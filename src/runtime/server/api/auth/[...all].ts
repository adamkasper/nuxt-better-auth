import { defineEventHandler, toWebRequest } from '#imports'

export default defineEventHandler((event) => {
  return serverAuth().handler(toWebRequest(event))
})
