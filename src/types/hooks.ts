import type { BetterAuthOptions } from 'better-auth'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    /**
     * Extend better-auth config with additional plugins or options.
     * Called after user's auth.config.ts is loaded.
     * @param config - Partial config to merge into the auth options
     */
    'better-auth:config:extend': (config: Partial<BetterAuthOptions>) => void | Promise<void>
  }
}
