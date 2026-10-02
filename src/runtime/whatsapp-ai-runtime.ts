import {
  getOrCreateConversation,
  applyIncomingMessage
} from "../conversation/conversation-orchestrator.js";

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

import {
  syncConversationBusinessState
} from "./business-state-bridge.js";

import {
  updateConversation
} from "../conversation/conversation-manager.js";

export interface IncomingWhatsAppMessage {
  sender:string;
  message:string;
  conversationId:string;
}

export interface RuntimeResponse {
  mode:"ai" | "human" | "assist";
  message:string;
  reason:string;
  conversationId:string;
  leadId?:string;
  leadPriority?:string;
}

export class WhatsAppAIRuntime {

  constructor(
    private readonly neuron:
      AvatarXNeuronClient
  ){}

  async respond(
    input:IncomingWhatsAppMessage
  ):Promise<RuntimeResponse>{

    const current =
      getOrCreateConversation(
        input.sender,
        input.conversationId
      );

    const {
      intent,
      conversation
    } =
      applyIncomingMessage(
        current,
        input.message
      );

    const handoff =
      evaluateHandoff({
        requestedHuman:
          intent === "human_request"
      });

    if(handoff.required){

      updateConversation(
        conversation.conversationId,
        {
          status:"human_handoff",
          humanHandoffReason:
            handoff.reason
        }
      );

      return {
        mode:handoff.mode,
        message:
          "Certainly. A member of the AvatarXStudio team will take over this conversation.",
        reason:handoff.reason,
        conversationId:
          conversation.conversationId
      };
    }

    const businessState =
      syncConversationBusinessState(
        conversation
      );

    const neuronRequest =
      buildWhatsAppNeuronRequest({
        sender:input.sender,
        message:input.message,
        conversationId:
          businessState
            .conversation
            .conversationId,
        conversationStatus:
          businessState
            .conversation
            .status,
        collectedData:
          businessState
            .conversation
            .collectedData
      });

    const result =
      await this.neuron.infer(
        neuronRequest
      );

    const decision =
      validateNeuronResponse(
        result.output?.text
      );

    if(
      !decision.allowed ||
      decision.requiresHuman
    ){

      updateConversation(
        conversation.conversationId,
        {
          status:"human_handoff",
          humanHandoffReason:
            decision.reason
        }
      );

      return {
        mode:"assist",
        message:
          "Thanks for sharing that. A member of the AvatarXStudio team will help you with this request.",
        reason:decision.reason,
        conversationId:
          conversation.conversationId,
        leadId:
          businessState.lead.id,
        leadPriority:
          businessState.priority
      };
    }

    return {
      mode:"ai",
      message:decision.response!,
      reason:"avatarx-neuron",
      conversationId:
        conversation.conversationId,
      leadId:
        businessState.lead.id,
      leadPriority:
        businessState.priority
    };
  }
}
