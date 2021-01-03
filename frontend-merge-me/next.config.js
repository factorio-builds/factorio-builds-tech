module.exports = {
  serverRuntimeConfig: {
    frontendUrl: process.env.FRONTEND_URL || 'https://local.factorio.tech',
    identityUrl: process.env.IDENTITY_URL || 'https://identity.local.factorio.tech',
    clientId: 'frontend',
    clientSecret: '511536EF-F270-4058-80CA-1C89C192F69A',
  },
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL || 'https://api.local.factorio.tech',
  },
}
