import { Request, Response } from 'express'
import mung from 'express-mung'

const isError = (res: Response) => res.statusCode > 399

export const transformToStandardResponse = (body: unknown, _req: Request, _res: Response) => {
  return { data: body }
}

export const transformToStandardError = (_body: unknown, _req: Request, _res: Response) => {
  return { errors: 'TODO' }
}

export const transformResponse = (body: unknown, req: Request, res: Response) => {
  return isError(res) ? transformToStandardError(body, req, res) : transformToStandardResponse(body, req, res)
}

// eslint-disable-next-line import/no-named-as-default-member
export const standardResponses = mung.json(transformResponse, {
  mungError: true,
})
