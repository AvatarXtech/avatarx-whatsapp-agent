
export type ConversationStatus =
  | "new"
  | "greeting"
  | "qualifying"
  | "project_details"
  | "lead_ready"
  | "human_handoff"
  | "closed";


export interface ConversationContext {

  conversationId:string;

  phone:string;

  status:ConversationStatus;

  collectedData:{

    name?:string;

    company?:string;

    projectType?:string;

    budget?:string;

    deadline?:string;

  };

  lastMessage?:string;

}

