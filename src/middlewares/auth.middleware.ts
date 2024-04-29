import { SECRET_KEY } from '@config'
import { jwt } from 'hono/jwt'

export const AuthMiddleware = () => jwt({ secret: SECRET_KEY })
