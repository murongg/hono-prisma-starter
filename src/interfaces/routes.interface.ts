import type { Hono } from 'hono'

export class Routes {
  constructor(public app: Hono, public path: string) {}
}
