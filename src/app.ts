import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { NODE_ENV, PORT } from './config'
import { logger } from './utils/logger'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import { ErrorMiddleware } from './middlewares/error.middleware'
import { UserRoute } from './routes/users.route'

export class App {
  public app: Hono
  public env: string
  public port: number

  constructor() {
    this.app = new Hono()
    this.env = NODE_ENV || 'development'
    this.port = PORT ? Number(PORT) : 3000
    this.initializeMiddlewares()
    this.initializeErrorHandling()
    this.initializeRoutes()
  }

  public listen() {
    serve({
      fetch: this.app.fetch,
      port: this.port,
    }, () => {
      logger.info('=================================')
      logger.info(`======= ENV: ${this.env} =======`)
      logger.info(`🚀 App listening on the port ${this.port}`)
      logger.info('=================================')
    })
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(LoggerMiddleware())
  }

  private initializeErrorHandling() {
    this.app.onError(ErrorMiddleware())
  }

  private initializeRoutes() {
    // eslint-disable-next-line no-new
    new UserRoute(this.app)
    // console.log(this.app.routes)
  }
}
