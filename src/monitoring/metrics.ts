

export interface Metric {


name:string;


value:number;


timestamp:Date;


}



export function createMetric(

 name:string,

 value:number

):Metric{


 return {

  name,

  value,

  timestamp:new Date()

 };

}

