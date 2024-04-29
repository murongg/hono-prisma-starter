import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { sign } from 'hono/jwt'
import { Service } from 'typedi'
import { SECRET_KEY } from '@config'
import type { CreateUserDto } from '@dtos/users.dto'
import type { DataStoredInToken, TokenData } from '@interfaces/auth.interface'
import type { User } from '@interfaces/users.interface'
import { HTTPException } from 'hono/http-exception'

@Service()
export class AuthService {
  public users = new PrismaClient().user

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.users.findUnique({ where: { email: userData.email } })
    if (findUser)
      throw new HTTPException(409, { message: `This email ${userData.email} already exists` })

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: Promise<User> = this.users.create({ data: { ...userData, password: hashedPassword } })

    return createUserData
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User; tokenData: TokenData }> {
    const findUser: User = await this.users.findUnique({ where: { email: userData.email } })
    if (!findUser)
      throw new HTTPException(409, { message: `This email ${userData.email} was not found` })

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password)
    if (!isPasswordMatching)
      throw new HTTPException(409, { message: 'Password is not matching' })

    const tokenData = await this.createToken(findUser)
    const cookie = this.createCookie(tokenData)

    return { cookie, findUser, tokenData }
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await this.users.findFirst({ where: { email: userData.email, password: userData.password } })
    if (!findUser)
      throw new HTTPException(409, { message: 'User doesn\'t exist' })

    return findUser
  }

  public async createToken(user: User): Promise<TokenData> {
    const dataStoredInToken: DataStoredInToken = { id: user.id }
    const secretKey: string = SECRET_KEY
    const expiresIn: number = 60 * 60
    const expiresInDate = new Date(Date.now() + expiresIn * 1000)

    return { expiresIn, token: await sign({ ...dataStoredInToken, exp: expiresInDate.getTime() }, secretKey) }
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }
}
