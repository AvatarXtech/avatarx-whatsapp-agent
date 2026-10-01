

import type {
 Lead,
 LeadPriority
} from "./lead-model.js";



export function calculateLeadScore(
 lead:Lead
){


 let score=0;



 if(lead.name)
  score += 10;



 if(lead.company)
  score += 15;



 if(lead.projectType)
  score += 20;



 if(lead.budget)
  score += 25;



 if(lead.timeline)
  score += 15;



 if(lead.requirement)
  score += 15;



 let priority:LeadPriority =
  "cold";


 if(score >=80)
  priority="enterprise";

 else if(score >=60)
  priority="hot";

 else if(score >=35)
  priority="warm";



 return {

  score,

  priority

 };

}

