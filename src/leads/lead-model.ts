
export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "converted"
  | "closed";


export type LeadPriority =
  | "cold"
  | "warm"
  | "hot"
  | "enterprise";


export interface Lead {

  id:string;

  name?:string;

  phone:string;

  company?:string;

  projectType?:string;

  budget?:string;

  timeline?:string;

  requirement?:string;

  source:
    | "website"
    | "whatsapp"
    | "instagram"
    | "referral";


  status:LeadStatus;

  priority:LeadPriority;

  score:number;

  createdAt:Date;

}

