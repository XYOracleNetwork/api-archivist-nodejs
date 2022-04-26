import { NextFunction } from 'express'
import Rollbar, { ExpressErrorHandler } from 'rollbar'

const noOpErrorHandler: ExpressErrorHandler = (err, _req, _res, next: NextFunction) => {
  next(err)
}

export const rollbarErrorHandler = (): ExpressErrorHandler => {
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
  return accessToken ? new Rollbar({ accessToken }).errorHandler : noOpErrorHandler
}
