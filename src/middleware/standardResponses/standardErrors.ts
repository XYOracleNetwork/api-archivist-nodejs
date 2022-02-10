import { ExpressError } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'

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
  res.status(error.statusCode).json({ errors: [body] })
  next(error)
}
