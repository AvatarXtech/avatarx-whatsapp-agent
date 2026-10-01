

export interface AuditEvent {


 id:string;


 action:string;


 userId:string;


 timestamp:Date;


}



class AuditLogger {


 private events:AuditEvent[]=[];



 record(

 event:AuditEvent

 ){

  this.events.push(event);

 }



 list(){

  return this.events;

 }


}


export const auditLogger =
 new AuditLogger();


