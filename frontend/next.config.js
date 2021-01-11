/* eslint-disable no-undef */
module.exports = {
  serverRuntimeConfig: {
    frontendUrl: process.env.FRONTEND_URL,
    identityUrl: process.env.IDENTITY_URL,
    clientId: "frontend",
    clientSecret: "511536EF-F270-4058-80CA-1C89C192F69A",
  },
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
  },
  images: {
    domains: [
      process.env.API_URL.replace("https://", "").replace("https://", ""),
    ],
  },
}
