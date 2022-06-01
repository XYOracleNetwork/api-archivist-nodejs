import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findByHash, requestCanAccessArchive } from '../../lib'
import { setRawResponseFormat } from '../../middleware'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

const getBlockForRequest = async (req: Request, hash: string): Promise<XyoPayload | undefined> => {
  for (const block of await findByHash(hash)) {
    if (!block?._archive) {
      continue
    }
    if (await requestCanAccessArchive(req, block._archive)) {
      return block
    }
  }
}

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
