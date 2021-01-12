import { initAuth0 } from "@auth0/nextjs-auth0"
import getConfig from "next/config"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default initAuth0({
  domain: publicRuntimeConfig.identityUrl.replace("https://", ""),
  clientId: serverRuntimeConfig.clientId,
  clientSecret: serverRuntimeConfig.clientSecret,
  scope: "openid profile",
  redirectUri: `${publicRuntimeConfig.frontendUrl}/api/callback`,
  postLogoutRedirectUri: `${publicRuntimeConfig.frontendUrl}/why-is-this-not-working`,
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: "b762654a-98e7-4c3a-9dbf-1e52d56d6f1b",
    //   // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    //   cookieLifetime: 60 * 60 * 8,
    //   // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    //   cookieDomain: 'your-domain.com',
    //   // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    //   cookieSameSite: 'lax',
    //   // (Optional) Store the id_token in the session. Defaults to false.
    storeIdToken: false,
    //   // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: true,
    //   // (Optional) Store the refresh_token in the session. Defaults to false.
    //   storeRefreshToken: false
  },
  // oidcClient: {
  //   // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
  //   httpTimeout: 2500,
  //   // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
  //   clockTolerance: 10000
  // }
})
