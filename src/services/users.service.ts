import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { Service } from 'typedi'
import type { CreateUserDto } from '@dtos/users.dto'
import type { User } from '@interfaces/users.interface'
import { HTTPException } from 'hono/http-exception'

@Service()
export class UserService {
  public user = new PrismaClient().user

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany()
    return allUser
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } })
    if (!findUser)
      throw new HTTPException(409, { message: 'User doesn\'t exist' })

    return findUser
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { email: userData.email } })
    if (findUser)
      throw new HTTPException(409, { message: `This email ${userData.email} already exists` })

    const hashedPassword = await hash(userData.password, 10)
    const createUserData: User = await this.user.create({ data: { ...userData, password: hashedPassword } })
    return createUserData
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } })
    if (!findUser)
      throw new HTTPException(409, { message: 'User doesn\'t exist' })

    const hashedPassword = await hash(userData.password, 10)
    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } })
    return updateUserData
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } })
    if (!findUser)
      throw new HTTPException(409, { message: 'User doesn\'t exist' })

    const deleteUserData = await this.user.delete({ where: { id: userId } })
    return deleteUserData
  }
}
