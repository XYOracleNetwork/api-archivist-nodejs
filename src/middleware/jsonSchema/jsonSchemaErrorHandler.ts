import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'express-json-validator-middleware'

import { respondWithStandardError } from './respondWithStandardError'

export const jsonSchemaErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err || res.headersSent) {
    return next(err)
  }
  const isValidationError = err instanceof ValidationError
  if (!isValidationError) {
    return next(err)
  }
  respondWithStandardError(err, req, res, next)
}
