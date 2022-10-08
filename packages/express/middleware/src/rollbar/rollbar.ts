import { Logger } from '@xyo-network/archivist-model'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

export const loggingErrorHandler = (logger: Logger): ErrorRequestHandler => {
  return (err: { message?: string; statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next()
    }
    if (err.statusCode && err.message) {
      if (err.statusCode > 499) {
        logger.error(err)
      } else if (err.statusCode > 399) {
        logger.warn(err)
      }
    }
    return next(err)
  }
}
