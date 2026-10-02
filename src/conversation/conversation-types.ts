export type ConversationStatus =
  | "new"
  | "greeting"
  | "qualifying"
  | "project_details"
  | "lead_ready"
  | "human_handoff"
  | "closed";

export interface ConversationCollectedData {
  name?:string;
  company?:string;
  projectType?:string;
  budget?:string;
  timeline?:string;
  deadline?:string;
  requirement?:string;
}

export interface ConversationContext {
  conversationId:string;
  phone:string;
  status:ConversationStatus;
  collectedData:ConversationCollectedData;
  lastMessage?:string;
  lastIntent?:string;
  leadId?:string;
  clientId?:string;
  projectId?:string;
  humanHandoffReason?:string;
}
