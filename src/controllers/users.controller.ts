import { Container } from 'typedi'
import type { User } from '@interfaces/users.interface'
import { UserService } from '@services/users.service'
import type { Context } from 'hono'

export class UserController {
  public user = Container.get(UserService)

  public getUsers = async (c: Context) => {
    const findAllUsersData: User[] = await this.user.findAllUser()
    c.status(200)
    return c.json({ data: findAllUsersData, message: 'findAll' })
  }

  public getUserById = async (c: Context) => {
    const userId = Number(c.req.param('id'))
    const findOneUserData: User = await this.user.findUserById(userId)
    return c.json({ data: findOneUserData, message: 'findOne' })
  }

  public createUser = async (c: Context) => {
    const userData = await c.req.json<User>()
    const createUserData: User = await this.user.createUser(userData)
    c.status(201)
    return c.json({ data: createUserData, message: 'created' })
  }

  public updateUser = async (c: Context) => {
    const userId = Number(c.req.param('id'))
    const userData = await c.req.json<User>()
    const updateUserData: User = await this.user.updateUser(userId, userData)

    return c.json({ data: updateUserData, message: 'updated' })
  }

  public deleteUser = async (c: Context) => {
    const userId = Number(c.req.param('id'))
    const deleteUserData: User = await this.user.deleteUser(userId)

    return c.json({ data: deleteUserData, message: 'deleted' })
  }
}

