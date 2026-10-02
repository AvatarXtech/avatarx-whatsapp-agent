import {
  randomUUID
} from "node:crypto";

import {
  sessionStore
} from "./session-store.js";

import type {
  ConversationStatus
} from "./conversation-types.js";

export function createConversation(
  phone:string,
  conversationId:string = randomUUID()
){
  return sessionStore.create({
    conversationId,
    phone,
    status:"new" as ConversationStatus,
    collectedData:{}
  });
}

export function updateConversation(
  id:string,
  data:any
){
  return sessionStore.update(id,data);
}

export function getConversation(
  id:string
){
  return sessionStore.get(id);
}
