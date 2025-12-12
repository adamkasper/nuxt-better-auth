import * as dbSchema from '#auth/db-schema'
import createServerAuth from '#auth/server'
import { useRuntimeConfig } from '#imports'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from 'hub:db'

type AuthInstance = ReturnType<typeof betterAuth>
let _auth: AuthInstance | undefined

export function serverAuth(): AuthInstance {
  if (_auth)
    return _auth

  const runtimeConfig = useRuntimeConfig()

  // User's config function receives context with db
  const userConfig = createServerAuth({ runtimeConfig, db })

  // Pass schema explicitly - NuxtHub's bundled schema doesn't preserve exports
  _auth = betterAuth({
    ...userConfig,
    database: drizzleAdapter(db, { provider: 'sqlite', schema: dbSchema }),
    secret: runtimeConfig.betterAuthSecret,
    baseURL: runtimeConfig.public.siteUrl,
  })

  return _auth
}
