import { initAuth0 } from "@auth0/nextjs-auth0"
import getConfig from "next/config"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default initAuth0({
  secret: "this value is ignored by IdentityServer",
  issuerBaseURL: publicRuntimeConfig.identityUrl,
  baseURL: publicRuntimeConfig.webUrl,
  clientID: serverRuntimeConfig.clientId,
  clientSecret: serverRuntimeConfig.clientSecret,
})
