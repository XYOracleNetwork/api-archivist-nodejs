import { ApiError, ApiErrorResponse, ApiLinks, getResponseMetadata } from '@xylabs/sdk-api-express-ecs'
import { ErrorObject } from 'ajv'
import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'express-json-validator-middleware'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const title = ReasonPhrases.BAD_REQUEST
const status = `${StatusCodes.BAD_REQUEST}`

const isErrorObject = (item: ErrorObject | undefined): item is ErrorObject => {
  return !!item
}

const validationErrorToApiError = (err: ErrorObject): ApiError => {
  const code = err.keyword
  const detail = err.message
  const links: ApiLinks = {
    dataPath: {
      href: err.dataPath,
      meta: {},
    },
    schemaPath: {
      href: err.schemaPath,
      meta: {
        parentSchema: err.parentSchema,
      },
    },
  }
  // const source = '' // TODO: Put query param errors here
  const meta = {
    params: err.params,
  }
  const error: ApiError = {
    code,
    detail,
    links,
    meta,
    status,
    title,
  }
  return error
}

const respondWithStandardError: ErrorRequestHandler = (err: ValidationError, _req, res, next) => {
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
