import 'reflect-metadata'
import bcrypt from 'bcrypt'
import { afterAll, describe, expect, it, vi } from 'vitest'

import type { CreateUserDto } from '@dtos/users.dto'
import { AuthRoute } from '@routes/auth.route'
import type { User } from '@prisma/client'
import { App } from '../app'

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500))
})

describe('Testing Auth', () => {
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      const app = new App()

      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }

      const authRoute = new AuthRoute(app.app)
      const users = authRoute.auth.auth.users

      users.findUnique = vi.fn().mockReturnValue(null)
      users.create = vi.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })

      const res = await app.app.request(`${authRoute.path}signup`, { method: 'post', body: new Blob([JSON.stringify(userData)]) })
      const json: any = await res.json()

      expect(res.status).toEqual(201)
      expect(json.message).toBe('signup')
      expect(json.data.id).toBe(1)
    })
  })

  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const app = new App()

      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }
      const authRoute = new AuthRoute(app.app)
      const users = authRoute.auth.auth.users

      users.findUnique = vi.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      })

      const res = await app.app.request(`${authRoute.path}login`, { method: 'post', body: new Blob([JSON.stringify(userData)]) })
      const json: any = await res.json()

      expect(res.status).toEqual(200)
      expect(res.headers.get('set-cookie')).toMatch(/^Authorization=.+/)
      expect(json.message).toBe('login')
    })
  })

  describe('[POST] /logout', () => {
    it('logout Set-Cookie Authorization=; Max-age=0', async () => {
      const app = new App()

      const user: User = {
        id: 1,
        email: 'test@email.com',
        password: 'q1w2e3r4',
      }

      const authRoute = new AuthRoute(app.app)
      const users = authRoute.auth.auth.users

      users.findFirst = vi.fn().mockReturnValue({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })

      const loginRes = await app.app.request(`${authRoute.path}login`, { method: 'post', body: new Blob([JSON.stringify(user)]) })
      const loginResData: any = await loginRes.json()
      const authorization = `Bearer ${loginResData.data.token}`
      const res = await app.app.request(`${authRoute.path}logout`, {
        method: 'post',
        body: new Blob([JSON.stringify(user)]),
        headers: {
          Authorization: authorization,
        },
      })
      const json: any = await res.json()

      expect(res.status).toEqual(200)
      expect(res.headers.get('set-cookie')).toMatch(/^Authorization=\;/)
      expect(json.message).toBe('logout')
    })
  })
})
