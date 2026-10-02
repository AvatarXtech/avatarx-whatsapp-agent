export interface NeuronResponseDecision {

  allowed:boolean;

  response?:string;

  reason:string;

}


const forbiddenPatterns = [

  /\bguaranteed price\b/i,

  /\bfinal quote\b/i,

  /\bcontract confirmed\b/i,

  /\bpayment confirmed\b/i

];


export function validateNeuronResponse(
  text:string | undefined
):NeuronResponseDecision{


  if(
    !text ||
    !text.trim()
  ){

    return {

      allowed:false,

      reason:
        "empty_neuron_response"

    };

  }


  for(
    const pattern
    of forbiddenPatterns
  ){

    if(pattern.test(text)){

      return {

        allowed:false,

        reason:
          "commercial_authority_violation"

      };

    }

  }


  return {

    allowed:true,

    response:
      text.trim(),

    reason:
      "approved"

  };

}
