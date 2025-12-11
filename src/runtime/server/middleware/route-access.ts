import type { AuthRouteRules } from '../../types'
import { defineEventHandler, getRouteRules } from '#imports'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/'))
    return

  const routeRules = getRouteRules(event)
  if (!routeRules)
    return

  const rules = routeRules as AuthRouteRules

  if (rules.role)
    await requireUserSession(event, { role: rules.role })
})
