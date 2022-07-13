import { Logger } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'
import Rollbar, { ExpressErrorHandler } from 'rollbar'

import dependencies from '../../inversify.config'

const defaultEnvironment = 'development'

const noOpErrorHandler: ExpressErrorHandler = (err, _req: Request, _res: Response, next: NextFunction) => {
  if (_res.headersSent) {
    return next()
  }
  return next(err)
}

export const rollbarErrorHandler = (): ExpressErrorHandler => {
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
  if (accessToken) {
    const environment = process.env.ROLLBAR_ENVIRONMENT || defaultEnvironment
    const logger = dependencies.get<Logger>('Logger')
    logger.log(`Configuring Rollbar for Environment: ${environment}`)
    return new Rollbar({ accessToken, environment }).errorHandler
  } else {
    return noOpErrorHandler
  }
}
