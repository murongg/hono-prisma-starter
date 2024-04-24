import { logger } from '@utils/logger'
import { logger as honoLogger } from 'hono/logger'

export const LoggerMiddleware = () => honoLogger((message: string, ...rest: string[]) => {
  logger.info(message, ...rest)
  console.log(message, ...rest)
})
