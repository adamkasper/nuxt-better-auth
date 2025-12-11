import type { H3Event } from 'h3'
import type { RoleName } from '../../types'
import { createError } from '#imports'

type Session = ReturnType<typeof serverAuth>['$Infer']['Session']

export async function getUserSession(event: H3Event): Promise<Session | null> {
  const auth = serverAuth()
  return await auth.api.getSession({ headers: event.headers }) as Session | null
}

export async function requireUserSession(event: H3Event, { role }: { role?: RoleName | RoleName[] } = {}): Promise<Session> {
  const session = await getUserSession(event)

  if (!session)
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })

  const user = session.user as { role?: string, banned?: boolean }

  if (user.banned)
    throw createError({ statusCode: 403, statusMessage: 'Account suspended', data: { banned: true } })

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role]
    if (!user.role || !allowedRoles.includes(user.role as RoleName))
      throw createError({ statusCode: 403, statusMessage: 'Insufficient permissions' })
  }

  return session
}
