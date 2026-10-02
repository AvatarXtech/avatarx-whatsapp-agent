import type {
  WhatsAppProvider,
  WhatsAppMessage
} from "../whatsapp-provider.js";

import type {
  MetaWhatsAppConfig
} from "./meta-config.js";

import {
  isMetaWhatsAppConfigured
} from "./meta-config.js";


export class MetaWhatsAppProvider
implements WhatsAppProvider {

  constructor(
    private readonly config:
      MetaWhatsAppConfig,

    private readonly fetchImpl:
      typeof fetch = fetch
  ) {}


  isConfigured(){

    return isMetaWhatsAppConfigured(
      this.config
    );

  }


  async sendMessage(
    message:WhatsAppMessage
  ):Promise<void> {

    if(!this.isConfigured()){

      throw new Error(
        "Meta WhatsApp provider is not configured"
      );

    }


    const endpoint =
      `https://graph.facebook.com/${this.config.graphApiVersion}/${this.config.phoneNumberId}/messages`;


    const response =
      await this.fetchImpl(
        endpoint,
        {
          method:"POST",

          headers:{
            "authorization":
              `Bearer ${this.config.accessToken}`,

            "content-type":
              "application/json"
          },

          body:
            JSON.stringify({
              messaging_product:
                "whatsapp",

              recipient_type:
                "individual",

              to:
                message.recipient,

              type:
                "text",

              text:{
                preview_url:false,
                body:
                  message.content
              }
            })
        }
      );


    if(!response.ok){

      let detail =
        `Meta WhatsApp API returned ${response.status}`;


      try{

        const payload =
          await response.json() as {
            error?:{
              message?:string;
            };
          };


        if(payload.error?.message){

          detail =
            payload.error.message;

        }

      }
      catch{
        // Keep safe HTTP error.
      }


      throw new Error(detail);

    }

  }

}
