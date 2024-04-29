import { AuthController } from '@controllers/auth.controller'
import { Routes } from '@interfaces/routes.interface'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import type { Hono } from 'hono'

export class AuthRoute extends Routes {
  public auth = new AuthController()

  constructor(public app: Hono) {
    super(app, '/')
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.app.post(`${this.path}signup`, this.auth.signUp)
    this.app.post(`${this.path}login`, this.auth.logIn)
    this.app.post(`${this.path}logout`, AuthMiddleware(), this.auth.logOut)
  }
}
