

import type {

 WhatsAppProvider,

 WhatsAppMessage

} from "./whatsapp-provider.js";



export class MockWhatsAppProvider
implements WhatsAppProvider {


 async sendMessage(
  message:WhatsAppMessage
 ){

  console.log(

   "MOCK WHATSAPP MESSAGE",

   message

  );

 }


}


