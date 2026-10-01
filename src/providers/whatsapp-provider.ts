

export interface WhatsAppMessage {

 recipient:string;

 content:string;

}


export interface WhatsAppProvider {


 sendMessage(
   message:WhatsAppMessage
 ):Promise<void>;


}


