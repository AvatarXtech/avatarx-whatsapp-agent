

export interface ValidationResult {


valid:boolean;

issues:string[];


}



export function validateResponse(

 response:string

):ValidationResult{


 const issues:string[]=[];


 const forbidden=[

  "guaranteed price",

  "instant delivery",

  "impossible"

 ];



 forbidden.forEach(

  item=>{

   if(response.toLowerCase().includes(item)){

    issues.push(item);

   }

  }

 );



 return {


  valid:
   issues.length===0,


  issues


 };


}


