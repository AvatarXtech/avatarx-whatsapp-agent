

import type {

 AgentMode

} from "./dashboard-model.js";



export interface HandoffDecision {


 required:boolean;


 reason:string;


 mode:AgentMode;


}



export function evaluateHandoff(

 input:{

  requestedHuman?:boolean;

  highValueLead?:boolean;

  negotiation?:boolean;

  lowConfidence?:boolean;

 }

):HandoffDecision {



 if(input.requestedHuman){

  return {

   required:true,

   reason:
    "Client requested human assistance",

   mode:"human"

  };

 }



 if(input.highValueLead){

  return {

   required:true,

   reason:
    "High value lead detected",

   mode:"human"

  };

 }



 if(input.negotiation){

  return {

   required:true,

   reason:
    "Negotiation requires human",

   mode:"assist"

  };

 }



 if(input.lowConfidence){

  return {

   required:true,

   reason:
    "AI confidence insufficient",

   mode:"assist"

  };

 }



 return {

  required:false,

  reason:
   "AI can continue",

  mode:"ai"

 };


}

