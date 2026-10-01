

export interface CertificationResult {


area:string;

status:"pass"|"pending";


}



export const readinessChecks:

CertificationResult[] = [


 {

 area:
 "Security",

 status:"pending"

 },


 {

 area:
 "Performance",

 status:"pending"

 },


 {

 area:
 "Business Flow",

 status:"pending"

 },


 {

 area:
 "AI Quality",

 status:"pending"

 },


 {

 area:
 "Production",

 status:"pending"

 }


];

