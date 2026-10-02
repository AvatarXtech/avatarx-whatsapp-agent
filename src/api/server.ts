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
                neuronHealth
            }
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
            .then(result => {

              console.log(
                "WHATSAPP_AI_RESPONSE_READY",
                {
                  recipient:
                    message.from,

                  mode:
                    result.mode,

                  reason:
                    result.reason
                }
              );

            })
            .catch(error => {

              console.error(
                "WHATSAPP_AI_RUNTIME_ERROR",
                {
                  recipient:
                    message.from,

                  error:
                    error instanceof Error
                      ? error.message
                      : String(error)
                }
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

        console.error(
          "WHATSAPP_SERVER_ERROR",
          error
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
