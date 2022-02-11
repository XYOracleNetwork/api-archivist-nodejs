import { Request, Response } from 'express'
import mung from 'express-mung'

import { getResponseMetadata } from '../metrics'

export const transformResponse = (body: unknown, _req: Request, res: Response) => {
  const meta = getResponseMetadata(res)
  return { data: body, meta }
}

// eslint-disable-next-line import/no-named-as-default-member
export const standardResponses = mung.json(transformResponse, {
  mungError: false,
})
