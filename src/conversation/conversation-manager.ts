
import {
  sessionStore
} from "./session-store.js";


import {
  ConversationStatus
} from "./conversation-types.js";


export function createConversation(
  phone:string
){

  return sessionStore.create({

    conversationId:
      crypto.randomUUID(),

    phone,

    status:
      "new" as ConversationStatus,

    collectedData:{}

  });

}



export function updateConversation(
  id:string,
  data:any
){

  return sessionStore.update(
    id,
    data
  );

}



export function getConversation(
  id:string
){

  return sessionStore.get(id);

}

