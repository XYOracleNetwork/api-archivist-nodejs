import { Request, Response } from 'express'
import mung from 'express-mung'

import { profileResponse } from '../metrics'

export const transformResponse = (body: unknown, _req: Request, res: Response) => {
  const meta = { perf: {} }
  const duration = profileResponse(res)
  if (duration) {
    meta.perf = duration
  }
  return { data: body, meta }
}

// eslint-disable-next-line import/no-named-as-default-member
export const standardResponses = mung.json(transformResponse, {
  mungError: false,
})
