import { RequestHandler } from 'express'

const handler: RequestHandler = (_req, res, _next) => {
  res.json({ valid: true })
}

export const postDebug: RequestHandler[] = [handler]
