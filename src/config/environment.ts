export const config = {

  environment:
    process.env.NODE_ENV || "development",

  port:
    Number(process.env.PORT || 4000)

};
