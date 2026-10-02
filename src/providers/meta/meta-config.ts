export interface MetaWhatsAppConfig {
  phoneNumberId:string;
  accessToken:string;
  graphApiVersion:string;
}


export function getMetaWhatsAppConfig(
  env:NodeJS.ProcessEnv = process.env
):MetaWhatsAppConfig {

  return {
    phoneNumberId:
      env.WHATSAPP_PHONE_NUMBER_ID ?? "",

    accessToken:
      env.WHATSAPP_ACCESS_TOKEN ?? "",

    graphApiVersion:
      env.WHATSAPP_GRAPH_API_VERSION ?? ""
  };

}


export function isMetaWhatsAppConfigured(
  config:MetaWhatsAppConfig
){

  return Boolean(
    config.phoneNumberId.trim() &&
    config.accessToken.trim() &&
    config.graphApiVersion.trim()
  );

}
