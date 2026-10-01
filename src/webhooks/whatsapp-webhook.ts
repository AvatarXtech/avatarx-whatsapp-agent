

export interface IncomingWhatsAppMessage {


from:string;

text:string;

timestamp:Date;


}



export function processWebhook(

 message:IncomingWhatsAppMessage

){

 return {

  source:"whatsapp",

  sender:
   message.from,

  content:
   message.text,

  receivedAt:
   message.timestamp

 };

}


