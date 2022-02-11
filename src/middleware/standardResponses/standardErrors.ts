import { ExpressError } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, Response } from 'express'

import { getResponseMetadata } from './getResponseMetadata'
import { IErrorObject, IErrorResponse } from './jsonApi'

export const standardErrors = (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  if (!err) {
    next(err)
    return
  }
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500

  const error: IErrorObject = {
    detail: err.message,
    status: `${err.statusCode}`,
    title: err.name,
  }
  const body: IErrorResponse = { errors: [error] }
  const meta = getResponseMetadata(res)
  if (meta) {
    body.meta = meta
  }

  res.status(err.statusCode).json(body)

  next(err)
}
