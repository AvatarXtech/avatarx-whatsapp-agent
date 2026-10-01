

export type LeadSource =

 | "website"

 | "instagram"

 | "referral"

 | "campaign"

 | "whatsapp";




export interface SourceRecord {

 source:LeadSource;

 capturedAt:Date;

}



export function trackSource(

 source:LeadSource

):SourceRecord {


 return {

  source,

  capturedAt:
   new Date()

 };

}


