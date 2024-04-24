import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { ErrorMiddleware } from '@middlewares/error.middleware'
import { LoggerMiddleware } from '@middlewares/logger.middleware'

const app = new Hono()

app.use(LoggerMiddleware())
app.onError(ErrorMiddleware())

app.get('/', (c) => {
  return c.text('Hello Hono 12!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
