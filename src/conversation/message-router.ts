

export type MessageIntent =

  | "greeting"

  | "service_question"

  | "pricing_question"

  | "project_request"

  | "human_request"

  | "unknown";




export function detectIntent(
  message:string
):MessageIntent {


  const text =
    message.toLowerCase();



  if(
    text.includes("hi") ||
    text.includes("hello")
  ){

    return "greeting";

  }



  if(
    text.includes("price") ||
    text.includes("cost") ||
    text.includes("budget")
  ){

    return "pricing_question";

  }



  if(
    text.includes("project") ||
    text.includes("video") ||
    text.includes("film")
  ){

    return "project_request";

  }



  if(
    text.includes("human") ||
    text.includes("person")
  ){

    return "human_request";

  }



  return "unknown";

}

