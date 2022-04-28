import { RequestHandler } from 'express'

export const getDebug: RequestHandler = (req, res, _next) => {
  res.json({})
}
