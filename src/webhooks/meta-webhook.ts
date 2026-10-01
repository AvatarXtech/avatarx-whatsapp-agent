

export interface MetaWebhookEvent {


 from:string;


 message:string;


 timestamp:number;


}



export function verifyWebhook(

 token:string,

 expected:string

){

 return token===expected;

}



export function processMetaWebhook(

 event:MetaWebhookEvent

){

 return {

  source:
   "meta-whatsapp",

  sender:
   event.from,

  message:
   event.message

 };

}

