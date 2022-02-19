import { ExpressError } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'

import { getResponseMetadata } from './getResponseMetadata'
import { ApiError, ApiErrorResponse } from './jsonApi'

export const standardErrors = (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    next(err)
    return
  }
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500

  const error: ApiError = {
    detail: err.message,
    status: `${err.statusCode}`,
    title: err.name,
  }
  const body: ApiErrorResponse = { errors: [error] }
  const meta = getResponseMetadata(res)
  if (meta) {
    body.meta = meta
  }

  res.status(err.statusCode).json(body)

  next(err)
}
