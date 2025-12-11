export default defineNuxtConfig({
  modules: ['@nuxthub/core', '../../../src/module'],

  hub: { db: 'sqlite' },

  runtimeConfig: {
    betterAuthSecret: 'test-secret-for-testing-only-32chars!',
    public: { siteUrl: '' },
  },

  routeRules: {
    '/protected': { auth: 'user' },
    '/admin': { auth: { role: 'admin' } },
    '/login': { auth: 'guest' },
  },
})
