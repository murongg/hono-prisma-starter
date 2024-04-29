import { UserController } from '@controllers/users.controller'
import { Routes } from '@interfaces/routes.interface'
import type { Hono } from 'hono'

export class UserRoute extends Routes {
  public user = new UserController()
  constructor(public app: Hono) {
    super(app, '/users')
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.app.get(`${this.path}`, this.user.getUsers)
    this.app.get(`${this.path}/:id(\\d+)`, this.user.getUserById)
    this.app.post(`${this.path}`, this.user.createUser)
    this.app.put(`${this.path}/:id(\\d+)`, this.user.updateUser)
    this.app.delete(`${this.path}/:id(\\d+)`, this.user.deleteUser)
  }
}

