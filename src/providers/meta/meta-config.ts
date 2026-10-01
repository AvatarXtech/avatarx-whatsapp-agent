

export interface MetaWhatsAppConfig {

 phoneNumberId:string;

 accessToken:string;

 businessId:string;

 webhookSecret:string;

}



export function getMetaConfig():

MetaWhatsAppConfig {


 return {

  phoneNumberId:
   process.env.WHATSAPP_PHONE_NUMBER_ID || "",


  accessToken:
   process.env.WHATSAPP_ACCESS_TOKEN || "",


  businessId:
   process.env.WHATSAPP_BUSINESS_ID || "",


  webhookSecret:
   process.env.WHATSAPP_WEBHOOK_SECRET || ""

 };


}

