/* eslint-disable no-undef */
module.exports = {
  serverRuntimeConfig: {
    clientId: process.env.CLIENT_ID || "frontend",
    clientSecret: process.env.CLIENT_SECRET || "511536EF-F270-4058-80CA-1C89C192F69A",
  },
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL || "https://api.local.factorio.tech",
    identityUrl: process.env.IDENTITY_URL || "https://identity.local.factorio.tech",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },
  images: {
    domains: [
      process.env.API_URL ? process.env.API_URL.replace("https://", "") : "api.local.factorio.tech",
    ],
  },
}
