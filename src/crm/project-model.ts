

export interface Project {


 id:string;


 clientId:string;


 title:string;


 serviceType:string;


 status:

  | "lead"

  | "discussion"

  | "production"

  | "completed";


}


