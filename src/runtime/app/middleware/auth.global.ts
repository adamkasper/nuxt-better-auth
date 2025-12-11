import type { AuthMeta, AuthMode, RoleName } from '../../types'
import { createError, defineNuxtRouteMiddleware, navigateTo, useRequestHeaders } from '#imports'

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

  // No auth meta = public page, skip auth checks
  if (auth === undefined || auth === false)
    return

  const { fetchSession, user, loggedIn, ready } = useUserSession()

  // Fetch session if not already loaded
  if (!loggedIn.value && !ready.value) {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    await fetchSession({ headers })
  }

  if (loggedIn.value && user.value?.banned)
    throw createError({ statusCode: 403, statusMessage: 'Account suspended', data: { banned: true } })

  const mode: AuthMode = typeof auth === 'string' ? auth : auth?.only ?? 'user'

  if (mode === 'guest') {
    if (loggedIn.value) {
      const redirectTarget = typeof auth === 'object' && auth.redirectTo ? auth.redirectTo : '/'
      return navigateTo(redirectTarget)
    }
    return
  }

  if (!loggedIn.value)
    return navigateTo('/login')

  const requiredRole = typeof auth === 'object' ? auth.role : undefined
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!user.value || !allowedRoles.includes(user.value.role as RoleName))
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }
})
