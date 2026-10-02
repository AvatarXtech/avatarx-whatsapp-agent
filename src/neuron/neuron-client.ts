import {
  createHash,
  createHmac
} from "node:crypto";


export const NEURON_INFERENCE_PATH =
  "/v1/inference";


export const NEURON_CLIENT_SERVICE =
  "avatarx-whatsapp-agent";


export interface NeuronInferenceRequest {

  requestId:string;

  tenantId:string;

  projectId:string;

  runId:string;

  traceId:string;

  capability:
    "text.reasoning";

  input:{
    prompt:string;
  };

}


export interface NeuronInferenceResult {

  requestId:string;

  status:string;

  capability:string;

  output?:{
    text?:string;
  };

  provider?:string;

}


export interface NeuronInferenceClient {

  infer(
    request:NeuronInferenceRequest
  ):Promise<NeuronInferenceResult>;

}


function sha256(
  value:string
){

  return createHash("sha256")
    .update(value)
    .digest("hex");

}


function signRequest(
  body:string,
  timestamp:string,
  secret:string
){

  const canonical = [

    "POST",

    NEURON_INFERENCE_PATH,

    timestamp,

    sha256(body)

  ].join("\n");


  return createHmac(
    "sha256",
    secret
  )
    .update(canonical)
    .digest("hex");

}


function required(
  value:string | undefined,
  name:string
){

  if(
    !value ||
    !value.trim()
  ){

    throw new Error(
      `${name} is not configured`
    );

  }


  return value;

}


export class AvatarXNeuronClient {


  private readonly baseUrl:string;

  private readonly serviceSecret:string;

  private readonly timeoutMs:number;


  constructor(
    env:NodeJS.ProcessEnv =
      process.env
  ){

    this.baseUrl =
      required(
        env.AVATARX_NEURON_URL,
        "AVATARX_NEURON_URL"
      )
      .replace(/\/$/u,"");


    this.serviceSecret =
      required(
        env.AVATARX_NEURON_SERVICE_AUTH_SECRET,
        "AVATARX_NEURON_SERVICE_AUTH_SECRET"
      );


    this.timeoutMs =
      Number(
        env.NEURON_REQUEST_TIMEOUT_MS ??
        5000
      );

  }


  async infer(
    request:NeuronInferenceRequest
  ):Promise<NeuronInferenceResult>{

    const body =
      JSON.stringify(request);


    const timestamp =
      String(Date.now());


    const signature =
      signRequest(
        body,
        timestamp,
        this.serviceSecret
      );


    const controller =
      new AbortController();


    const timeout =
      setTimeout(
        () => controller.abort(),
        this.timeoutMs
      );


    try{

      const response =
        await fetch(
          `${this.baseUrl}${NEURON_INFERENCE_PATH}`,
          {

            method:"POST",

            signal:
              controller.signal,

            headers:{

              "content-type":
                "application/json",

              "x-avatarx-service":
                NEURON_CLIENT_SERVICE,

              "x-avatarx-timestamp":
                timestamp,

              "x-avatarx-signature":
                signature,

              "x-request-id":
                request.requestId,

              "x-tenant-id":
                request.tenantId

            },

            body

          }
        );


      const payload =
        await response.json() as {

          result?:
            NeuronInferenceResult;

          error?:{
            code?:string;
            message?:string;
          };

        };


      if(!response.ok){

        throw new Error(
          payload.error?.message ??
          `AvatarXNeuron returned ${response.status}`
        );

      }


      if(!payload.result){

        throw new Error(
          "AvatarXNeuron returned no inference result"
        );

      }


      if(
        payload.result.requestId !==
        request.requestId
      ){

        throw new Error(
          "AvatarXNeuron requestId mismatch"
        );

      }


      if(
        payload.result.capability !==
        request.capability
      ){

        throw new Error(
          "AvatarXNeuron capability mismatch"
        );

      }


      return payload.result;

    }
    finally{

      clearTimeout(timeout);

    }

  }


  async health(){

    const controller =
      new AbortController();


    const timeout =
      setTimeout(
        () => controller.abort(),
        this.timeoutMs
      );


    try{

      const response =
        await fetch(
          `${this.baseUrl}/health`,
          {
            signal:
              controller.signal
          }
        );


      return {
        configured:true,
        reachable:
          response.ok,
        status:
          response.status
      };

    }
    catch{

      return {
        configured:true,
        reachable:false,
        status:0
      };

    }
    finally{

      clearTimeout(timeout);

    }

  }

}
