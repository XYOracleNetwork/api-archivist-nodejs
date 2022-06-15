import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { setRawResponseFormat } from '../../middleware'
import { getBlockForRequest } from './getBlockForRequest'
import { HashPathParams } from './HashPathParams'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

const handler: RequestHandler<HashPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  if (res.headersSent) {
    return
  }
  const { hash } = req.params
  if (!hash) {
    next({ message: 'Hash not supplied', statusCode: StatusCodes.BAD_REQUEST })
    return
  }
  if (reservedHashes.find((reservedHash) => reservedHash === hash)) {
    next()
    return
  }
  const block = await getBlockForRequest(req, hash)
  if (block) {
    setRawResponseFormat(res)
    res.json({ ...deepOmitUnderscoreFields(block) })
    return
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
}

export const getByHash = asyncHandler(handler)
