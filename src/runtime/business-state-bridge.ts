import {
  randomUUID
} from "node:crypto";

import {
  crmService
} from "../crm/crm-service.js";

import {
  createLead
} from "../leads/lead-manager.js";

import {
  calculateLeadScore
} from "../leads/lead-score-engine.js";

import {
  leadService
} from "../leads/lead-service.js";

import {
  updateConversation
} from "../conversation/conversation-manager.js";

import type {
  ConversationContext
} from "../conversation/conversation-types.js";

export function syncConversationBusinessState(
  conversation:ConversationContext
){
  const data =
    conversation.collectedData;

  let lead =
    leadService.findByPhone(
      conversation.phone
    );

  if(!lead){
    lead =
      createLead({
        phone:conversation.phone,
        source:"whatsapp",
        name:data.name,
        company:data.company,
        projectType:data.projectType,
        budget:data.budget,
        timeline:
          data.timeline ??
          data.deadline,
        requirement:data.requirement
      });
  }

  const scoring =
    calculateLeadScore(lead);

  lead.score =
    scoring.score;

  lead.priority =
    scoring.priority;

  if(
    scoring.score >= 35 &&
    lead.status === "new"
  ){
    lead.status =
      "qualified";
  }

  let clientId =
    conversation.clientId;

  if(
    !clientId &&
    data.name
  ){
    const client =
      crmService.addClient({
        id:randomUUID(),
        name:data.name,
        company:data.company,
        phone:conversation.phone,
        createdAt:new Date()
      });

    clientId =
      client.id;
  }

  let projectId =
    conversation.projectId;

  if(
    clientId &&
    !projectId &&
    data.projectType
  ){
    const project =
      crmService.addProject({
        id:randomUUID(),
        clientId,
        title:
          `${data.projectType} enquiry`,
        serviceType:
          data.projectType,
        status:"lead"
      });

    projectId =
      project.id;
  }

  const leadReady =
    scoring.score >= 60;

  const updated =
    updateConversation(
      conversation.conversationId,
      {
        leadId:lead.id,
        clientId,
        projectId,
        status:
          leadReady
            ? "lead_ready"
            : conversation.status
      }
    );

  return {
    conversation:
      updated ?? conversation,
    lead,
    score:scoring.score,
    priority:scoring.priority,
    leadReady,
    clientId,
    projectId
  };
}
