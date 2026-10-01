
export type UserRole =

 | "admin"

 | "manager"

 | "operator";



export interface User {

 id:string;

 email:string;

 role:UserRole;

 active:boolean;

}

