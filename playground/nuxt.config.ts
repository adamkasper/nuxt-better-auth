export default defineNuxtConfig({
  modules: ['@nuxthub/core', '../src/module'],

  hub: { db: 'sqlite' },

  devtools: { enabled: true },

  runtimeConfig: {
    betterAuthSecret: 'dev-secret-change-in-production-32+',
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },

  routeRules: {
    '/app/**': { auth: 'user' },
    '/admin/**': { auth: { role: 'admin' } },
    '/login': { auth: 'guest' },
  },

  compatibilityDate: '2025-01-01',
})
