import { logger } from '@utils/logger'
import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'

export const ErrorMiddleware = (): ErrorHandler => {
  return (err, c) => {
    let status: StatusCode = 500
    if (err instanceof HTTPException)
      status = err.status

    logger.error(`[${c.req.method}] ${c.req.path} >> StatusCode:: ${status}, Message:: ${err.message}`)
    return c.json({
      message: err.message,
    }, status)
  }
}
