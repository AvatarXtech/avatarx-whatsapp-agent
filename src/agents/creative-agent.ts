

export interface CreativeBrief {


 mood?:string;

 style?:string;

 audience?:string;

 references?:string[];

 storyDirection?:string;


}



export function buildCreativeBrief(
 input:CreativeBrief
){


 return {

   briefCreated:true,

   creativeDirection:{

    mood:
     input.mood || "not specified",

    style:
     input.style || "not specified",

    audience:
     input.audience || "not specified",

    references:
     input.references || [],

    storyDirection:
     input.storyDirection || "not specified"

   }

 };


}

