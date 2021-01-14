import { initAuth0 } from "@auth0/nextjs-auth0"
import getConfig from "next/config"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default initAuth0({
  domain: new URL(publicRuntimeConfig.identityUrl).hostname,
  clientId: serverRuntimeConfig.clientId,
  clientSecret: serverRuntimeConfig.clientSecret,
  scope: "openid profile",
  redirectUri: `${publicRuntimeConfig.webUrl}/api/callback`,
  postLogoutRedirectUri: `${publicRuntimeConfig.webUrl}/why-is-this-not-working`,
  session: {
    cookieSecret: serverRuntimeConfig.cookieSecret,
    storeIdToken: false,
    storeAccessToken: true,
    //   storeRefreshToken: false
  },
  // oidcClient: {
  //   // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
  //   httpTimeout: 2500,
  //   // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
  //   clockTolerance: 10000
  // }
})
