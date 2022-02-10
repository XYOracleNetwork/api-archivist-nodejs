import { Request, Response } from 'express'
import { json, Options } from 'express-mung'

const isError = (res: Response) => res.statusCode < 400

export const transformToStandardResponse = (body, _req: Request, _res: Response) => {
  return { data: { ...body } }
}

export const transformToStandardError = (body, _req: Request, _res: Response) => {
  return body
}

export const transformResponse = (body, req: Request, res: Response) => {
  if (isError(res)) {
    transformToStandardResponse(body, req, res)
  } else {
    transformToStandardError(body, req, res)
  }
}

const opts: Options = {
  mungError: true,
}

export const standardResponses = json(transformToStandardResponse, opts)
