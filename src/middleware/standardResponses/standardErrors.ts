import { ExpressError } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'

import { profileResponse } from '../metrics'

export const standardErrors = (error: ExpressError, req: Request, res: Response, next: NextFunction) => {
  if (!error) {
    next(error)
    return
  }
  console.error(error.message)
  if (!error.statusCode) error.statusCode = 500
  const body = {
    detail: error.message,
    status: `${error.statusCode}`,
    title: error.name,
  }
  const meta = { perf: {} }
  const duration = profileResponse(res)
  if (duration) {
    meta.perf = duration
  }
  res.status(error.statusCode).json({ errors: [body], meta })
  next(error)
}
