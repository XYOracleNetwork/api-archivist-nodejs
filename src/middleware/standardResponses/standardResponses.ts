import { Request, Response } from 'express'
import mung from 'express-mung'

export const transformResponse = (body: unknown, _req: Request, _res: Response) => {
  return { data: body }
}

// eslint-disable-next-line import/no-named-as-default-member
export const standardResponses = mung.json(transformResponse, {
  mungError: false,
})
