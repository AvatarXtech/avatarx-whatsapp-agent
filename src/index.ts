import "dotenv/config";


import {
  createProductionServer
} from "./api/server.js";


import {
  logEvent
} from "./monitoring/index.js";


const port =
  Number(
    process.env.PORT ??
    4000
  );


const server =
  createProductionServer();


server.listen(
  port,
  () => {

    logEvent(
      "avatarx-whatsapp-agent.started",
      {
        port,
        neuron:
          process.env
            .AVATARX_NEURON_URL ??
          "unconfigured"
      }
    );

  }
);


function shutdown(
  signal:string
){

  logEvent(
    "avatarx-whatsapp-agent.shutdown",
    {
      signal
    }
  );


  server.close(
    () => process.exit(0)
  );

}


process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);


process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);
