
import {
  ConversationContext
} from "./conversation-types.js";


class SessionStore {


  private sessions =
    new Map<string, ConversationContext>();


  create(
    session:ConversationContext
  ){

    this.sessions.set(
      session.conversationId,
      session
    );

    return session;

  }



  get(
    id:string
  ){

    return this.sessions.get(id);

  }



  update(
    id:string,
    data:Partial<ConversationContext>
  ){

    const current =
      this.sessions.get(id);


    if(!current){

      return null;

    }


    const updated = {

      ...current,
      ...data

    };


    this.sessions.set(
      id,
      updated
    );


    return updated;

  }



  remove(
    id:string
  ){

    this.sessions.delete(id);

  }


}


export const sessionStore =
  new SessionStore();

