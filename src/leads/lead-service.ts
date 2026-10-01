

import type {
 Lead
} from "./lead-model.js";


class LeadService {


 private leads:
  Lead[] = [];



 create(
  lead:Lead
 ){

  this.leads.push(
    lead
  );

  return lead;

 }



 findAll(){

  return this.leads;

 }



 findByPhone(
  phone:string
 ){

  return this.leads.find(
    lead =>
    lead.phone === phone
  );

 }



}


export const leadService =
 new LeadService();

