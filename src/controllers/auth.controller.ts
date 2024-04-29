import { Container } from 'typedi'
import type { User } from '@interfaces/users.interface'
import { AuthService } from '@services/auth.service'
import type { Context } from 'hono'

export class AuthController {
  public auth = Container.get(AuthService)

  public signUp = async (c: Context) => {
    const userData = await c.req.json<User>()
    const signUpUserData: User = await this.auth.signup(userData)
    c.status(201)
    return c.json({ data: signUpUserData, message: 'signup' })
  }

  public logIn = async (c: Context) => {
    const userData = await c.req.json<User>()
    const { cookie, findUser, tokenData } = await this.auth.login(userData)

    c.header('Set-Cookie', cookie)
    return c.json({
      data: {
        ...findUser,
        ...tokenData,
      },
      message: 'login',
    })
  }

  public logOut = async (c: Context) => {
    const userData = c.get('jwtPayload')
    const logOutUserData: User = await this.auth.logout(userData)

    c.header('Set-Cookie', 'Authorization=; Max-age=0')
    return c.json({ data: logOutUserData, message: 'logout' })
  }
}
