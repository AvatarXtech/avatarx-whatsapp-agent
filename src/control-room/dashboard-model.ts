
export type AgentMode =

  | "ai"

  | "assist"

  | "human";



export interface ConversationDashboard {


 id:string;


 clientPhone:string;


 clientName?:string;


 mode:AgentMode;


 status:

   | "active"

   | "waiting"

   | "closed";


 lastMessage?:string;


 updatedAt:Date;


}



export interface LeadDashboard {


 leadId:string;


 name?:string;


 company?:string;


 projectType?:string;


 score:number;


 priority:string;


}

