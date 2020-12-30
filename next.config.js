module.exports = {
  serverRuntimeConfig: {
    frontendUrl: process.env.FRONTEND_URL || "https://local.factorio.tech",
    identityUrl:
      process.env.IDENTITY_URL || "https://identity.local.factorio.tech",
    clientId: "nextjs-client",
    clientSecret: "511536EF-F270-4058-80CA-1C89C192F69A",
  },
  images: {
    domains: [
      "factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com",
    ],
  },
}
