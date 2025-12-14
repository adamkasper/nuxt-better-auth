import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const { db, schema } = await import('hub:db')
    if (!schema.session)
      return { sessions: [], error: 'Session table not found' }

    const sessions = await db.select().from(schema.session).limit(100)
    return { sessions }
  }
  catch (error: any) {
    return { sessions: [], error: error.message || 'Failed to fetch sessions' }
  }
})
