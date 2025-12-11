import type { AuthSession, AuthUser } from '#nuxt-better-auth'
import { defineNuxtPlugin, useState } from '#imports'

export default defineNuxtPlugin({
  name: 'auth:session-init',
  enforce: 'pre',
  setup() {
    // Just initialize state - session will be fetched client-side
    useState<AuthSession | null>('auth:session', () => null)
    useState<AuthUser | null>('auth:user', () => null)
    useState('auth:ready', () => false)
  },
})
