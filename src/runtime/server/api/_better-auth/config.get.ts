import { defineEventHandler } from 'h3'
import { serverAuth } from '../../utils/auth'

export default defineEventHandler(async () => {
  try {
    const auth = await serverAuth()
    const options = auth.options

    return {
      config: {
        baseURL: options.baseURL,
        basePath: options.basePath || '/api/auth',
        socialProviders: Object.keys(options.socialProviders || {}),
        plugins: (options.plugins || []).map((p: any) => p.id || 'unknown'),
        trustedOrigins: options.trustedOrigins || [],
      },
    }
  }
  catch (error: any) {
    return { config: null, error: error.message || 'Failed to fetch config' }
  }
})
