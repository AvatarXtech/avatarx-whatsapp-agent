import {
  randomUUID
} from "node:crypto";


import {
  faqKnowledge
} from "../knowledge/faq.js";


import {
  serviceKnowledge
} from "../knowledge/services.js";


import {
  studioKnowledge
} from "../knowledge/studio.js";


export interface WhatsAppNeuronContext {

  sender:string;

  message:string;

  conversationId:string;

  conversationStatus:string;

  collectedData?:
    Record<string,unknown>;

}


export function buildWhatsAppNeuronRequest(
  context:
    WhatsAppNeuronContext
){

  const requestId =
    randomUUID();


  const runId =
    randomUUID();


  const traceId =
    randomUUID();


  const systemContext = {

    channel:
      "whatsapp",

    business:
      studioKnowledge,

    services:
      serviceKnowledge,

    faq:
      faqKnowledge,

    conversation:{

      id:
        context.conversationId,

      status:
        context.conversationStatus,

      collectedData:
        context.collectedData ?? {}

    },

    policies:[

      "Never invent project prices.",

      "Do not make contractual commitments.",

      "Do not negotiate commercial terms autonomously.",

      "Escalate explicit human requests.",

      "Keep replies concise and appropriate for WhatsApp.",

      "Only use AvatarXStudio information supplied in context."

    ]

  };


  const prompt = [

    "You are the conversational intelligence for AvatarXStudio.",

    "",

    "BUSINESS CONTEXT:",

    JSON.stringify(
      systemContext,
      null,
      2
    ),

    "",

    "CUSTOMER MESSAGE:",

    context.message,

    "",

    "Return only the customer-facing WhatsApp reply."

  ].join("\n");


  return {

    requestId,

    tenantId:
      "avatarxstudio",

    projectId:
      context.conversationId,

    runId,

    traceId,

    capability:
      "text.reasoning" as const,

    input:{
      prompt
    }

  };

}
