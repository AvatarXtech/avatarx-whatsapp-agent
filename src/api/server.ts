import http from "node:http";


import {
  AvatarXNeuronClient
} from "../neuron/neuron-client.js";


import {
  WhatsAppAIRuntime
} from "../runtime/whatsapp-ai-runtime.js";


import {
  normalizeMetaWebhook,
  verifyWebhook
} from "../webhooks/meta-webhook.js";


import {
  MetaWhatsAppProvider
} from "../providers/meta/meta-whatsapp-provider.js";


import {
  getMetaWhatsAppConfig
} from "../providers/meta/meta-config.js";


import {
  logEvent,
  whatsappMetrics
} from "../monitoring/index.js";


function sendJson(
  response:http.ServerResponse,
  status:number,
  value:unknown
){

  response.writeHead(
    status,
    {
      "content-type":
        "application/json"
    }
  );

  response.end(
    JSON.stringify(value)
  );

}


async function readBody(
  request:http.IncomingMessage
){

  const chunks:
    Buffer[] = [];


  for await(
    const chunk
    of request
  ){

    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk)
    );

  }


  return Buffer.concat(chunks)
    .toString("utf8");

}


export function createProductionServer(){

  const neuron =
    new AvatarXNeuronClient();


  const runtime =
    new WhatsAppAIRuntime(
      neuron
    );


  const metaProvider =
    new MetaWhatsAppProvider(
      getMetaWhatsAppConfig()
    );


  return http.createServer(
    async(
      request,
      response
    ) => {

      try{

        const url =
          new URL(
            request.url ?? "/",
            "http://localhost"
          );


        if(
          request.method === "GET" &&
          url.pathname === "/health"
        ){

          const neuronHealth =
            await neuron.health();


          return sendJson(
            response,
            200,
            {
              status:"ok",
              service:
                "avatarx-whatsapp-agent",
              neuron:
                neuronHealth,
              metaConfigured:
                metaProvider.isConfigured(),
              metrics:
                whatsappMetrics.snapshot()
            }
          );

        }


        if(
          request.method === "GET" &&
          url.pathname === "/ready"
        ){

          const neuronHealth =
            await neuron.health();


          const ready =
            neuronHealth.reachable === true;


          return sendJson(
            response,
            ready ? 200 : 503,
            {
              status:
                ready
                  ? "ready"
                  : "degraded",

              neuron:
                neuronHealth,

              metaConfigured:
                metaProvider.isConfigured()
            }
          );

        }


        if(
          request.method === "GET" &&
          url.pathname === "/metrics"
        ){

          return sendJson(
            response,
            200,
            whatsappMetrics.snapshot()
          );

        }


        if(
          request.method === "GET" &&
          url.pathname ===
            "/webhooks/whatsapp"
        ){

          const mode =
            url.searchParams.get(
              "hub.mode"
            );


          const token =
            url.searchParams.get(
              "hub.verify_token"
            ) ?? "";


          const challenge =
            url.searchParams.get(
              "hub.challenge"
            ) ?? "";


          const expected =
            process.env
              .WHATSAPP_WEBHOOK_SECRET ??
            "";


          if(
            mode === "subscribe" &&
            verifyWebhook(
              token,
              expected
            )
          ){

            response.writeHead(
              200,
              {
                "content-type":
                  "text/plain"
              }
            );

            return response.end(
              challenge
            );

          }


          return sendJson(
            response,
            403,
            {
              error:
                "webhook_verification_failed"
            }
          );

        }


        if(
          request.method === "POST" &&
          url.pathname ===
            "/webhooks/whatsapp"
        ){

          whatsappMetrics.increment(
            "webhookRequests"
          );


          const raw =
            await readBody(
              request
            );


          let payload:unknown;


          try{

            payload =
              JSON.parse(raw);

          }
          catch{

            return sendJson(
              response,
              400,
              {
                error:
                  "invalid_json"
              }
            );

          }


          const messages =
            normalizeMetaWebhook(
              payload
            );


          whatsappMetrics.increment(
            "webhookMessages",
            messages.length
          );


          logEvent(
            "whatsapp.webhook.received",
            {
              messageCount:
                messages.length
            }
          );


          /*
           * Meta should receive an acknowledgement
           * quickly. Full outbound Meta sending will
           * be wired after WA-PROD-3 credentials exist.
           */

          sendJson(
            response,
            200,
            {
              received:true,
              count:
                messages.length
            }
          );


          for(
            const message
            of messages
          ){

            runtime.respond({

              sender:
                message.from,

              message:
                message.message,

              conversationId:
                `wa:${message.from}`

            })
            .then(async result => {

              if(
                result.mode === "ai"
              ){

                whatsappMetrics.increment(
                  "aiResponses"
                );

              }
              else if(
                result.mode === "human"
              ){

                whatsappMetrics.increment(
                  "humanHandoffs"
                );

              }
              else{

                whatsappMetrics.increment(
                  "assistedHandoffs"
                );

              }


              logEvent(
                "whatsapp.response.ready",
                {
                  recipient:
                    message.from,

                  mode:
                    result.mode,

                  reason:
                    result.reason
                }
              );


              if(
                metaProvider.isConfigured()
              ){

                await metaProvider.sendMessage({

                  recipient:
                    message.from,

                  content:
                    result.message

                });


                whatsappMetrics.increment(
                  "metaSendSuccess"
                );


                logEvent(
                  "whatsapp.meta.sent",
                  {
                    recipient:
                      message.from
                  }
                );

              }
              else{

                whatsappMetrics.increment(
                  "metaSendSkipped"
                );


                logEvent(
                  "whatsapp.meta.send_skipped",
                  {
                    recipient:
                      message.from,

                    reason:
                      "meta_credentials_not_configured"
                  },
                  "warn"
                );

              }

            })
            .catch(error => {

              whatsappMetrics.increment(
                "neuronErrors"
              );


              logEvent(
                "whatsapp.runtime.error",
                {
                  recipient:
                    message.from,

                  error:
                    error instanceof Error
                      ? error.message
                      : String(error)
                },
                "error"
              );

            });

          }


          return;

        }


        return sendJson(
          response,
          404,
          {
            error:
              "not_found"
          }
        );

      }
      catch(error){

        logEvent(
          "whatsapp.server.error",
          {
            error:
              error instanceof Error
                ? error.message
                : String(error)
          },
          "error"
        );


        if(
          !response.headersSent
        ){

          return sendJson(
            response,
            500,
            {
              error:
                "internal_error"
            }
          );

        }

      }

    }
  );

}
