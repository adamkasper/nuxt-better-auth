import type { AppAuthClient } from '#auth/client'
import type { AuthSession, AuthUser } from '#nuxt-better-auth'
import { createAppAuthClient } from '#auth/client'
import { computed, useRequestHeaders, useRuntimeConfig, useState } from '#imports'
import { consola } from 'consola'

export function useUserSession() {
  const runtimeConfig = useRuntimeConfig()

  // Client only - create better-auth client for client-side operations
  const client: AppAuthClient | null = import.meta.client
    ? createAppAuthClient(runtimeConfig.public.siteUrl || window.location.origin)
    : null

  const session = useState<AuthSession | null>('auth:session', () => null)
  const user = useState<AuthUser | null>('auth:user', () => null)
  const sessionFetching = useState('auth:sessionFetching', () => false)
  const authReady = useState('auth:ready', () => false)
  const ready = computed(() => authReady.value)
  const loggedIn = computed(() => Boolean(session.value && user.value))

  function clearSession() {
    session.value = null
    user.value = null
  }

  function updateUser(updates: Partial<AuthUser>) {
    if (user.value)
      user.value = { ...user.value, ...updates }
  }

  async function fetchSession(options: { headers?: HeadersInit, force?: boolean } = {}) {
    // On server, session is already fetched by server middleware - nothing to do
    if (import.meta.server) {
      if (!authReady.value)
        authReady.value = true
      return
    }

    if (sessionFetching.value && !options.force)
      return

    sessionFetching.value = true
    try {
      if (client) {
        const headers = options.headers || useRequestHeaders(['cookie'])
        const fetchOptions = headers ? { headers } : undefined
        const result = await client.getSession({}, fetchOptions)
        const data = result.data as { session: AuthSession, user: AuthUser } | null

        if (data?.session && data?.user) {
          session.value = data.session
          user.value = data.user
        }
        else {
          clearSession()
        }
      }
    }
    catch (error) {
      clearSession()
      if (import.meta.dev)
        consola.error('Failed to fetch auth session:', error)
    }
    finally {
      sessionFetching.value = false
      if (!authReady.value)
        authReady.value = true
    }
  }

  async function signOut(...args: Parameters<NonNullable<typeof client>['signOut']>) {
    if (!client)
      throw new Error('signOut can only be called on client-side')
    const response = await client.signOut(...args)
    clearSession()
    return response
  }

  return {
    // Core state
    client,
    session,
    user,
    loggedIn,
    ready,
    // Methods - signIn/signUp only available on client
    signIn: client?.signIn,
    signUp: client?.signUp,
    signOut,
    fetchSession,
    updateUser,
  }
}
