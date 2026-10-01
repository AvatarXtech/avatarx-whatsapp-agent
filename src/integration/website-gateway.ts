
export interface WebsiteLeadRequest {

 name?:string;

 phone?:string;

 service?:string;

 message?:string;

}



export function createWebsiteConversation(

 input:WebsiteLeadRequest

){

 return {

  source:
    "website",

  receivedAt:
    new Date(),

  customer:

  {

   name:
    input.name,

   phone:
    input.phone

  },

  requirement:
    input.message,

  service:
    input.service

 };

}

