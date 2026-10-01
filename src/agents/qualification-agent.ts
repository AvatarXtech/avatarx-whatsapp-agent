

export interface LeadInformation {

 name?:string;

 company?:string;

 projectType?:string;

 budget?:string;

 timeline?:string;

 requirement?:string;

}



export function qualifyLead(
 data:LeadInformation
){


 const completedFields =
 Object.values(data)
 .filter(Boolean)
 .length;



 let score = 0;



 if(completedFields >= 2)
   score += 30;


 if(completedFields >= 4)
   score += 40;


 if(data.projectType)
   score += 20;


 if(data.timeline)
   score += 10;



 return {

   score,

   priority:
    score >=70
     ? "high"
     : "normal",

   data

 };


}

