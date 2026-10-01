

import type {

 ConversationDashboard

} from "./dashboard-model.js";



export function createConversationView(

 conversation:ConversationDashboard

){


 return {


  id:
   conversation.id,


  customer:
   conversation.clientName || "Unknown",


  phone:
   conversation.clientPhone,


  mode:
   conversation.mode,


  status:
   conversation.status,


  lastMessage:
   conversation.lastMessage || "",


  updated:
   conversation.updatedAt


 };


}

