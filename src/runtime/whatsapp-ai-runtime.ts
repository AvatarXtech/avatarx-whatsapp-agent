import {
  randomUUID
} from "node:crypto";


import {
  detectIntent
} from "../conversation/message-router.js";


import {
  evaluateHandoff
} from "../control-room/handoff-manager.js";


import {
  AvatarXNeuronClient
} from "../neuron/neuron-client.js";


import {
  buildWhatsAppNeuronRequest
} from "../neuron/whatsapp-context.js";


import {
  validateNeuronResponse
} from "../neuron/response-gate.js";


export interface IncomingWhatsAppMessage {

  sender:string;

  message:string;

  conversationId?:string;

  conversationStatus?:string;

  collectedData?:
    Record<string,unknown>;

}


export interface RuntimeResponse {

  mode:
    "ai" |
    "human" |
    "assist";

  message:string;

  reason:string;

}


export class WhatsAppAIRuntime {


  constructor(
    private readonly neuron:
      AvatarXNeuronClient
  ){}


  async respond(
    input:IncomingWhatsAppMessage
  ):Promise<RuntimeResponse>{


    const intent =
      detectIntent(
        input.message
      );


    const handoff =
      evaluateHandoff({

        requestedHuman:
          intent ===
          "human_request"

      });


    if(handoff.required){

      return {

        mode:
          handoff.mode,

        message:
          "Certainly. A member of the AvatarXStudio team will take over this conversation.",

        reason:
          handoff.reason

      };

    }


    const request =
      buildWhatsAppNeuronRequest({

        sender:
          input.sender,

        message:
          input.message,

        conversationId:
          input.conversationId ??
          randomUUID(),

        conversationStatus:
          input.conversationStatus ??
          "new",

        collectedData:
          input.collectedData

      });


    const result =
      await this.neuron.infer(
        request
      );


    const decision =
      validateNeuronResponse(
        result.output?.text
      );


    if(!decision.allowed){

      return {

        mode:"assist",

        message:
          "Thanks for sharing that. A member of the AvatarXStudio team will help you with this request.",

        reason:
          decision.reason

      };

    }


    return {

      mode:"ai",

      message:
        decision.response!,

      reason:
        "avatarx-neuron"

    };

  }

}
