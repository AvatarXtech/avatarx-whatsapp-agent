export interface MetricSnapshot {
  startedAt:string;
  uptimeSeconds:number;
  webhookRequests:number;
  webhookMessages:number;
  aiResponses:number;
  humanHandoffs:number;
  assistedHandoffs:number;
  neuronErrors:number;
  metaSendSuccess:number;
  metaSendFailures:number;
  metaSendSkipped:number;
}


class WhatsAppMetrics {

  private readonly started =
    Date.now();

  private counters = {
    webhookRequests:0,
    webhookMessages:0,
    aiResponses:0,
    humanHandoffs:0,
    assistedHandoffs:0,
    neuronErrors:0,
    metaSendSuccess:0,
    metaSendFailures:0,
    metaSendSkipped:0
  };


  increment(
    name:keyof typeof this.counters,
    amount = 1
  ){

    this.counters[name] += amount;

  }


  snapshot():MetricSnapshot {

    return {
      startedAt:
        new Date(
          this.started
        ).toISOString(),

      uptimeSeconds:
        Math.floor(
          (
            Date.now() -
            this.started
          ) / 1000
        ),

      ...this.counters
    };

  }


  reset(){

    for(
      const key
      of Object.keys(
        this.counters
      ) as Array<
        keyof typeof this.counters
      >
    ){

      this.counters[key] = 0;

    }

  }

}


export const whatsappMetrics =
  new WhatsAppMetrics();
