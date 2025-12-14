import type { AuthMeta, AuthMode } from '../../types'
import { createError, defineNuxtRouteMiddleware, navigateTo, useRequestHeaders, useRuntimeConfig } from '#imports'
import { matchesUser } from '../../utils/match-user'

declare module '#app' {
  interface PageMeta {
    auth?: AuthMeta
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthMeta
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = to.meta.auth as AuthMeta | undefined

  if (auth === undefined || auth === false)
    return

  const config = useRuntimeConfig().public.auth as { redirects: { login: string, guest: string } } | undefined
  const { fetchSession, user, loggedIn, ready } = useUserSession()

  if (!loggedIn.value && !ready.value) {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    await fetchSession({ headers })
  }

  const mode: AuthMode = typeof auth === 'string' ? auth : auth?.only ?? 'user'
  const redirectTo = typeof auth === 'object' ? auth.redirectTo : undefined

  if (mode === 'guest') {
    if (loggedIn.value)
      return navigateTo(redirectTo ?? config?.redirects?.guest ?? '/')
    return
  }

  if (!loggedIn.value)
    return navigateTo(redirectTo ?? config?.redirects?.login ?? '/login')

  if (typeof auth === 'object' && auth.user) {
    if (!user.value || !matchesUser(user.value, auth.user))
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }
})
