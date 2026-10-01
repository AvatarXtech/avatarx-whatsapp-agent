

import type {

 WhatsAppProvider,

 WhatsAppMessage

} from "../whatsapp-provider.js";



export class MetaWhatsAppProvider

implements WhatsAppProvider {


 constructor(

 private accessToken:string

 ){}



 async sendMessage(

 message:WhatsAppMessage

 ){


 if(!this.accessToken){

   throw new Error(
    "Missing WhatsApp access token"
   );

 }


 console.log(
  "META WHATSAPP MESSAGE READY",
  {
   recipient:
    message.recipient
  }
 );



 }


}

