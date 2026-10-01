

import type {

 ConversationDashboard

} from "./dashboard-model.js";



class ConversationMonitor {


 private conversations:
 ConversationDashboard[] = [];



 add(

 conversation:ConversationDashboard

 ){

  this.conversations.push(
    conversation
  );

 }



 list(){

  return this.conversations;

 }



 find(id:string){

  return this.conversations.find(

    item =>
    item.id === id

  );

 }


}



export const conversationMonitor =
 new ConversationMonitor();

