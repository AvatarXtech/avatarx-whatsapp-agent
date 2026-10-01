

import {
 leadService
} from "./lead-service.js";


import type {
 Lead
} from "./lead-model.js";



export function createLead(
 data:Partial<Lead>
){


 const lead:Lead={

  id:
   crypto.randomUUID(),

  phone:
   data.phone || "",

  source:
   data.source || "whatsapp",

  status:
   "new",

  priority:
   "cold",

  score:
   0,

  createdAt:
   new Date(),


  name:
   data.name,


  company:
   data.company,


  projectType:
   data.projectType,


  budget:
   data.budget,


  timeline:
   data.timeline,


  requirement:
   data.requirement

 };


 return leadService.create(
  lead
 );


}

