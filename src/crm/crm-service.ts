

import type {

 Client

} from "./client-model.js";


import type {

 Project

} from "./project-model.js";



class CRMService {


 private clients:
 Client[]=[];


 private projects:
 Project[]=[];



 addClient(

 client:Client

 ){

  this.clients.push(client);

  return client;

 }



 addProject(

 project:Project

 ){

  this.projects.push(project);

  return project;

 }



 getClients(){

  return this.clients;

 }



 getProjects(){

  return this.projects;

 }


}



export const crmService =
 new CRMService();


