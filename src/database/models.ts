
export interface Conversation {

 id:string;

 phone:string;

 status:
   | "new"
   | "active"
   | "closed";

 createdAt:Date;

 updatedAt:Date;

}



export interface Message {

 id:string;

 conversationId:string;

 sender:
   | "client"
   | "ai"
   | "human";

 content:string;

 timestamp:Date;

}



export interface Lead {

 id:string;

 name:string;

 phone:string;

 company?:string;

 projectType?:string;

 budget?:string;

 status:
   | "cold"
   | "warm"
   | "hot";

}



export interface ProjectBrief {

 id:string;

 leadId:string;

 requirement:string;

 deadline?:string;

 references?:string[];

}

