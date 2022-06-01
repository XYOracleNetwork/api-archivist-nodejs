import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findByHash, isPublicArchive, isRequestUserOwnerOfArchive } from '../../lib'
import { setRawResponseFormat } from '../../middleware'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

const getBlockForRequest = async (req: Request, hash: string): Promise<XyoPayload | undefined> => {
  for (const block of await findByHash(hash)) {
    const name = block?._archive
    if (!name) {
      continue
    }
    const archive = await req.app.archiveRepository.get(name)
    // If the archive is public or if the archive is private but this is
    // an auth'd request from the archive owner
    if (isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)) {
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
