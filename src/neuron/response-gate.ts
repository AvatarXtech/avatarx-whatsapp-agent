export interface NeuronResponseDecision {
  allowed:boolean;
  response?:string;
  reason:string;
  requiresHuman:boolean;
}

const hardBlockedPatterns = [
  /\bguaranteed price\b/i,
  /\bfinal quote\b/i,
  /\bcontract confirmed\b/i,
  /\bpayment confirmed\b/i,
  /\bwe guarantee\b/i,
  /\bguaranteed delivery\b/i
];

const negotiationPatterns = [
  /\bdiscount\b/i,
  /\bnegotiat/i,
  /\bfinal price\b/i
];

export function validateNeuronResponse(
  text:string | undefined
):NeuronResponseDecision{

  if(!text?.trim()){
    return {
      allowed:false,
      requiresHuman:true,
      reason:"empty_neuron_response"
    };
  }

  for(const pattern of hardBlockedPatterns){
    if(pattern.test(text)){
      return {
        allowed:false,
        requiresHuman:true,
        reason:
          "commercial_authority_violation"
      };
    }
  }

  for(const pattern of negotiationPatterns){
    if(pattern.test(text)){
      return {
        allowed:false,
        requiresHuman:true,
        reason:
          "commercial_negotiation_requires_human"
      };
    }
  }

  return {
    allowed:true,
    requiresHuman:false,
    response:text.trim(),
    reason:"approved"
  };
}
