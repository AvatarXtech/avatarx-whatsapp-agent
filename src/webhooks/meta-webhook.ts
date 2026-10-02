export interface NormalizedMetaMessage {

  from:string;

  message:string;

  messageId:string;

  timestamp:number;

}


export function verifyWebhook(
  token:string,
  expected:string
){

  return Boolean(
    token &&
    expected &&
    token === expected
  );

}


export function normalizeMetaWebhook(
  payload:unknown
):NormalizedMetaMessage[]{


  const output:
    NormalizedMetaMessage[] = [];


  if(
    !payload ||
    typeof payload !== "object"
  ){

    return output;

  }


  const root =
    payload as any;


  const entries =
    Array.isArray(root.entry)
      ? root.entry
      : [];


  for(
    const entry
    of entries
  ){

    const changes =
      Array.isArray(entry?.changes)
        ? entry.changes
        : [];


    for(
      const change
      of changes
    ){

      const messages =
        Array.isArray(
          change?.value?.messages
        )
          ? change.value.messages
          : [];


      for(
        const message
        of messages
      ){

        if(
          typeof message?.from !==
            "string" ||
          typeof message?.id !==
            "string"
        ){

          continue;

        }


        const text =
          message?.text?.body;


        if(
          typeof text !==
          "string" ||
          !text.trim()
        ){

          continue;

        }


        output.push({

          from:
            message.from,

          message:
            text,

          messageId:
            message.id,

          timestamp:
            Number(
              message.timestamp ??
              Date.now()
            )

        });

      }

    }

  }


  return output;

}
