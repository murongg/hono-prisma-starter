import 'reflect-metadata'
import { afterAll, describe, expect, it, vi } from 'vitest'
import bcrypt from 'bcrypt'
import type { CreateUserDto } from '@dtos/users.dto'
import { UserRoute } from '@routes/users.route'
import { App } from '../app'

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500))
})

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      const app = new App()
      const usersRoute = new UserRoute(app.app)
      const users = usersRoute.user.user.user

      users.findMany = vi.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ])
      const res = await app.app.request(`${usersRoute.path}`)
      const json: any = await res.json()

      expect(res.status).toEqual(200)
      expect(json.message).toBe('findAll')
      expect(json.data.length).toBe(3)
    })
  })

  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1

      const app = new App()

      const usersRoute = new UserRoute(app.app)
      const users = usersRoute.user.user.user

      users.findUnique = vi.fn().mockReturnValue({
        id: 1,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      })
      const res = await app.app.request(`${usersRoute.path}/${userId}`)
      const json: any = await res.json()

      expect(res.status).toEqual(200)
      expect(json.message).toBe('findOne')
      expect(json.data.id).toBe(1)
    })
  })

  describe('[POST] /users', () => {
    it('response Create user', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }
      const app = new App()

      const usersRoute = new UserRoute(app.app)
      const users = usersRoute.user.user.user

      users.findUnique = vi.fn().mockReturnValue(null)
      users.create = vi.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })

      const res = await app.app.request(`${usersRoute.path}`, { method: 'post', body: new Blob([JSON.stringify(userData)]) })
      const json: any = await res.json()
      expect(res.status).toEqual(201)
      expect(json.message).toBe('created')
      expect(json.data.id).toBe(1)
    })
  })

  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }
      const app = new App()

      const usersRoute = new UserRoute(app.app)
      const users = usersRoute.user.user.user

      users.findUnique = vi.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })
      users.update = vi.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })

      const res = await app.app.request(`${usersRoute.path}/${userId}`, { method: 'put', body: new Blob([JSON.stringify(userData)]) })
      const json: any = await res.json()
      expect(res.status).toEqual(200)
      expect(json.message).toBe('updated')
      expect(json.data.id).toBe(1)
    })
  })

  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }
      const app = new App()

      const usersRoute = new UserRoute(app.app)
      const users = usersRoute.user.user.user

      users.findUnique = vi.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })
      users.delete = vi.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })

      const res = await app.app.request(`${usersRoute.path}/${userId}`, { method: 'delete' })
      const json: any = await res.json()
      expect(res.status).toEqual(200)
      expect(json.message).toBe('deleted')
      expect(json.data.id).toBe(1)
    })
  })
})
