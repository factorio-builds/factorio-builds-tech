/* eslint-disable no-undef */
module.exports = {
  serverRuntimeConfig: {
    clientId: process.env.CLIENT_ID || "frontend",
    clientSecret: process.env.CLIENT_SECRET || "511536EF-F270-4058-80CA-1C89C192F69A",
  },
  publicRuntimeConfig: {
    webUrl: process.env.WEB_URL || "http://localhost:3000",
    apiUrl: process.env.API_URL || "https://api.local.factorio.tech",
    identityUrl: process.env.IDENTITY_URL || "https://identity.local.factorio.tech",
    cdnUrl: process.env.CDN_URL || "https://api.local.factorio.tech/assets",
    enableApplicationInsights: process.env.ENABLE_APPLICATION_INSIGHTS || false,
    instrumentationKey: process.env.INSTRUMENTATION_KEY,
  },
  images: {
    domains: [
      new URL(process.env.API_URL || "https://api.local.factorio.tech").hostname,
      new URL(process.env.CDN_URL || "https://api.local.factorio.tech/assets").hostname,
    ],
  },
}
