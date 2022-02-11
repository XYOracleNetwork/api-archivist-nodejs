import { Request, Response } from 'express'
import mung from 'express-mung'

import { getResponseMetadata } from './getResponseMetadata'

/**
 * Transforms each response to conform to the standard response format (compatible with JSON API)
 * @param body The original request body
 * @param _req The request
 * @param res The response
 * @returns The transformed response body
 */
export const transformResponse = (body: unknown, _req: Request, res: Response) => {
  const meta = getResponseMetadata(res)
  return { data: body, meta }
}

/**
 * Connect middleware to enable the transform of all responses to match
 * the standard response format (compatible with JSON API)
 */
// eslint-disable-next-line import/no-named-as-default-member
export const standardResponses = mung.json(transformResponse, {
  mungError: false,
})
