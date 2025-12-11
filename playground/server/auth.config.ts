import { admin } from 'better-auth/plugins'
import { defineServerAuth } from '../../src/runtime/config'

export default defineServerAuth(() => ({
  appName: 'Nuxt Better Auth Playground',
  plugins: [admin()],
  emailAndPassword: { enabled: true },
}))
