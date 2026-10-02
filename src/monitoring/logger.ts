export type LogLevel =
  | "info"
  | "warn"
  | "error";


export function logEvent(
  event:string,
  data:Record<string,unknown> = {},
  level:LogLevel = "info"
){

  const payload = {
    timestamp:
      new Date().toISOString(),

    service:
      "avatarx-whatsapp-agent",

    level,

    event,

    ...data
  };


  const line =
    JSON.stringify(
      payload
    );


  if(level === "error"){

    console.error(line);

    return;

  }


  if(level === "warn"){

    console.warn(line);

    return;

  }


  console.log(line);

}
