import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const { db, schema } = await import('hub:db')
    if (!schema.user)
      return { users: [], error: 'User table not found' }

    const users = await db.select().from(schema.user).limit(100)
    return { users }
  }
  catch (error: any) {
    return { users: [], error: error.message || 'Failed to fetch users' }
  }
})
