import {
  createConversation,
  getConversation,
  updateConversation
} from "./conversation-manager.js";

import {
  detectIntent
} from "./message-router.js";

import type {
  ConversationContext,
  ConversationStatus
} from "./conversation-types.js";

function deriveStatus(
  current:ConversationContext,
  intent:string
):ConversationStatus{

  if(intent === "human_request"){
    return "human_handoff";
  }

  if(
    current.status === "new" &&
    intent === "greeting"
  ){
    return "greeting";
  }

  if(
    intent === "project_request" ||
    intent === "pricing_question"
  ){
    return "qualifying";
  }

  if(current.status === "greeting"){
    return "qualifying";
  }

  return current.status;
}

export function getOrCreateConversation(
  phone:string,
  conversationId:string
){
  const existing =
    getConversation(conversationId);

  if(existing){
    return existing;
  }

  return createConversation(
    phone,
    conversationId
  );
}

export function applyIncomingMessage(
  current:ConversationContext,
  message:string
){
  const intent =
    detectIntent(message);

  const status =
    deriveStatus(
      current,
      intent
    );

  const updated =
    updateConversation(
      current.conversationId,
      {
        lastMessage:message,
        lastIntent:intent,
        status
      }
    );

  return {
    intent,
    conversation:
      updated ?? {
        ...current,
        lastMessage:message,
        lastIntent:intent,
        status
      }
  };
}
