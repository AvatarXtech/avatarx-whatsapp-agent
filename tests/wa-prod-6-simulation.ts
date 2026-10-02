import assert from "node:assert/strict";

import {
  WhatsAppAIRuntime
} from "../src/runtime/whatsapp-ai-runtime.js";

import type {
  NeuronInferenceClient,
  NeuronInferenceRequest,
  NeuronInferenceResult
} from "../src/neuron/neuron-client.js";

import {
  MetaWhatsAppProvider
} from "../src/providers/meta/meta-whatsapp-provider.js";


class SafeNeuron
implements NeuronInferenceClient {

  calls = 0;

  async infer(
    request:NeuronInferenceRequest
  ):Promise<NeuronInferenceResult> {

    this.calls += 1;

    return {
      requestId:
        request.requestId,

      status:
        "completed",

      capability:
        request.capability,

      output:{
        text:
          "Thanks for contacting AvatarXStudio. Please tell us more about your project."
      },

      provider:
        "simulation"
    };

  }

}


class UnsafeNeuron
implements NeuronInferenceClient {

  async infer(
    request:NeuronInferenceRequest
  ):Promise<NeuronInferenceResult> {

    return {
      requestId:
        request.requestId,

      status:
        "completed",

      capability:
        request.capability,

      output:{
        text:
          "This is your final quote and guaranteed price."
      },

      provider:
        "simulation"
    };

  }

}


async function main(){

  console.log(
    "WA_PROD_6_SIMULATION_START"
  );


  {
    const neuron =
      new SafeNeuron();

    const runtime =
      new WhatsAppAIRuntime(
        neuron
      );

    const result =
      await runtime.respond({
        sender:
          "919999999999",

        message:
          "Hi, I need a commercial video",

        conversationId:
          "wa:test-safe"
      });

    assert.equal(
      result.mode,
      "ai"
    );

    assert.equal(
      result.reason,
      "avatarx-neuron"
    );

    assert.equal(
      neuron.calls,
      1
    );

    console.log(
      "SCENARIO_AI_REPLY=PASS"
    );
  }


  {
    const neuron =
      new SafeNeuron();

    const runtime =
      new WhatsAppAIRuntime(
        neuron
      );

    const result =
      await runtime.respond({
        sender:
          "919999999998",

        message:
          "I want to speak to a human",

        conversationId:
          "wa:test-human"
      });

    assert.equal(
      result.mode,
      "human"
    );

    assert.equal(
      neuron.calls,
      0
    );

    console.log(
      "SCENARIO_HUMAN_HANDOFF=PASS"
    );
  }


  {
    const runtime =
      new WhatsAppAIRuntime(
        new UnsafeNeuron()
      );

    const result =
      await runtime.respond({
        sender:
          "919999999997",

        message:
          "Tell me about pricing",

        conversationId:
          "wa:test-governance"
      });

    assert.equal(
      result.mode,
      "assist"
    );

    assert.equal(
      result.reason,
      "commercial_authority_violation"
    );

    console.log(
      "SCENARIO_COMMERCIAL_GOVERNANCE=PASS"
    );
  }


  {
    let request:
      {
        url?:string;
        init?:RequestInit;
      } | undefined;


    const fakeFetch =
      async(
        url:URL | RequestInfo,
        init?:RequestInit
      ) => {

        request = {
          url:String(url),
          init
        };


        return new Response(
          JSON.stringify({
            messages:[
              {
                id:
                  "wamid.test"
              }
            ]
          }),
          {
            status:200,
            headers:{
              "content-type":
                "application/json"
            }
          }
        );

      };


    const provider =
      new MetaWhatsAppProvider(
        {
          phoneNumberId:
            "test-phone-id",

          accessToken:
            "test-token",

          graphApiVersion:
            "test-version"
        },

        fakeFetch as typeof fetch
      );


    await provider.sendMessage({
      recipient:
        "919999999996",

      content:
        "Test AvatarXStudio response"
    });


    assert.ok(
      request?.url?.includes(
        "/test-phone-id/messages"
      )
    );


    assert.equal(
      request?.init?.method,
      "POST"
    );


    console.log(
      "SCENARIO_META_OUTBOUND_CONTRACT=PASS"
    );

  }


  console.log(
    "WA_PROD_6_SIMULATION=PASS"
  );

}


main().catch(error => {

  console.error(
    "WA_PROD_6_SIMULATION=FAIL",
    error
  );

  process.exitCode = 1;

});
