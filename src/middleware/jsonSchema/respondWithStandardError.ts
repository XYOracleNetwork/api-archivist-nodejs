import { ApiError, ApiErrorResponse, getResponseMetadata } from '@xylabs/sdk-api-express-ecs'
import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import { StatusCodes } from 'http-status-codes'

import { isErrorObject } from './isErrorObject'
import { validationErrorToApiError } from './validationErrorToApiError'

export const respondWithStandardError: ErrorRequestHandler = (err: ValidationError, _req, res, next) => {
  const { body, params, query } = err.validationErrors
  const errors: ApiError[] = [body, params, query]
    .flatMap((e) => e)
    .filter(isErrorObject)
    .map(validationErrorToApiError)
  const name = err.name
  const result: ApiErrorResponse = {
    errors,
    meta: { name },
  }
  const meta = getResponseMetadata(res)
  if (meta) {
    result.meta = meta
  }
  res.status(StatusCodes.BAD_REQUEST).json(result)
  next()
}
