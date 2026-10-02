import assert from "node:assert/strict";

import {
  whatsappMetrics
} from "../src/monitoring/metrics.js";


function main(){

  whatsappMetrics.reset();


  whatsappMetrics.increment(
    "webhookRequests"
  );

  whatsappMetrics.increment(
    "webhookMessages",
    2
  );

  whatsappMetrics.increment(
    "aiResponses"
  );

  whatsappMetrics.increment(
    "humanHandoffs"
  );

  whatsappMetrics.increment(
    "metaSendSkipped"
  );


  const snapshot =
    whatsappMetrics.snapshot();


  assert.equal(
    snapshot.webhookRequests,
    1
  );

  assert.equal(
    snapshot.webhookMessages,
    2
  );

  assert.equal(
    snapshot.aiResponses,
    1
  );

  assert.equal(
    snapshot.humanHandoffs,
    1
  );

  assert.equal(
    snapshot.metaSendSkipped,
    1
  );

  assert.ok(
    snapshot.startedAt
  );

  assert.ok(
    snapshot.uptimeSeconds >= 0
  );


  console.log(
    "WA_PROD_7_MONITORING=PASS"
  );

}


main();
