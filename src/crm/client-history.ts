

export interface ClientHistoryRecord {


 clientId:string;


 conversations:string[];


 projects:string[];


 preferences:string[];


}



export function createClientHistory(

 clientId:string

):ClientHistoryRecord {


 return {

  clientId,

  conversations:[],

  projects:[],

  preferences:[]

 };

}


