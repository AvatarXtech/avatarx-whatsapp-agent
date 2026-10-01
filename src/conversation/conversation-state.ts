
import {
 ConversationStatus
} from "./conversation-types.js";



const transitions:Record<
 ConversationStatus,
 ConversationStatus[]
> = {


new:[
 "greeting"
],


greeting:[
 "qualifying"
],


qualifying:[
 "project_details",
 "human_handoff"
],


project_details:[
 "lead_ready",
 "human_handoff"
],


lead_ready:[
 "human_handoff",
 "closed"
],


human_handoff:[
 "closed"
],


closed:[]

};



export function canTransition(

 from:ConversationStatus,

 to:ConversationStatus

){

 return transitions[from]
   .includes(to);

}




export function transition(

 from:ConversationStatus,

 to:ConversationStatus

){

 if(!canTransition(from,to)){

   throw new Error(
    `Invalid transition ${from} -> ${to}`
   );

 }


 return to;

}

