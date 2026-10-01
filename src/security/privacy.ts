

export interface DataPolicy {


 conversationRetentionDays:number;


 allowHumanAccess:boolean;


}



export const defaultPrivacyPolicy:DataPolicy={

 conversationRetentionDays:365,

 allowHumanAccess:true

};


