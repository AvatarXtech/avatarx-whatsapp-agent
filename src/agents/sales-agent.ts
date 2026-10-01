
import {
 detectIntent
} from "../conversation/message-router.js";


export interface AgentResponse {

 message:string;

 nextAction:string;

}



export function salesAgent(
 input:string
):AgentResponse {


 const intent =
   detectIntent(input);



 switch(intent){


 case "greeting":

  return {

   message:
    "Welcome to AvatarXStudio. We create Social Media Reels, Commercial Videos and Brand Films. How can we help with your project?",

   nextAction:
    "collect_requirement"

  };



 case "pricing_question":

  return {

   message:
    "We can help estimate your project based on scope, duration and creative requirements.",

   nextAction:
    "qualification"

  };



 case "project_request":

  return {

   message:
    "Great. Let us understand your project requirements.",

   nextAction:
    "qualification"

  };



 default:

  return {

   message:
    "Please share more details about your video requirement.",

   nextAction:
    "collect_requirement"

  };


 }


}

