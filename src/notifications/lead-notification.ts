

import type {
 Lead
} from "../leads/lead-model.js";



export function createLeadNotification(
 lead:Lead
){


 return {

  title:
   "NEW QUALIFIED LEAD",


  message:

`
Name:
${lead.name || "Unknown"}

Company:
${lead.company || "Unknown"}

Project:
${lead.projectType || "Unknown"}

Score:
${lead.score}

Priority:
${lead.priority}
`


 };


}

