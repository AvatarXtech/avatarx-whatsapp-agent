

export function logEvent(

 event:string,

 data?:unknown

){

 console.log(

  JSON.stringify({

   event,

   data,

   timestamp:
    new Date()

  })

 );

}

