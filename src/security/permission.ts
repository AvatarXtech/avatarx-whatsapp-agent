
import type {
 UserRole
} from "./auth-model.js";


export function canManageLeads(
 role:UserRole
){

 return [

  "admin",

  "manager"

 ].includes(role);

}



export function canChangeSystemSettings(
 role:UserRole
){

 return role==="admin";

}

