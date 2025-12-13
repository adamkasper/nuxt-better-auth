import { passkey } from '@better-auth/passkey'
import { admin } from 'better-auth/plugins'
import { defineServerAuth } from '../../src/runtime/config'

export default defineServerAuth(() => ({
  appName: 'Nuxt Better Auth Playground',
  plugins: [admin(), passkey()],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log('\n=== PASSWORD RESET ===')
      console.log('To:', user.email)
      console.log('URL:', url)
      console.log('======================\n')
    },
  },
}))
