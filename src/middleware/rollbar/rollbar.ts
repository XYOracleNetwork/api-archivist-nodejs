import { NextFunction } from 'express'
import Rollbar, { ExpressErrorHandler } from 'rollbar'

const defaultEnvironment = 'development'

const noOpErrorHandler: ExpressErrorHandler = (err, _req, _res, next: NextFunction) => {
  next(err)
}

export const rollbarErrorHandler = (): ExpressErrorHandler => {
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
  if (accessToken) {
    const environment = process.env.ROLLBAR_ENVIRONMENT || defaultEnvironment
    console.log(`Configuring Rollbar for Environment: ${environment}`)
    return new Rollbar({ accessToken, environment }).errorHandler
  } else {
    return noOpErrorHandler
  }
}
