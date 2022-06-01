import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findByHash, isPublicArchive, isRequestUserOwnerOfArchive } from '../../lib'
import { setRawResponseFormat } from '../../middleware'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

export type HashResponse = Record<string, unknown>

const validateUserCanAccessBlock: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const { hash } = req.params
  if (!hash) {
    next({ message: 'Hash not supplied', statusCode: StatusCodes.BAD_REQUEST })
  }
  if (res.headersSent) {
    return
  } else if (reservedHashes.find((reservedHash) => reservedHash === hash)) {
    console.warn(`This should not happen: ':hash' path did not run: [res.headersSent !== true, reservedHashes did find, ${hash}]`)
    next({ message: 'Error processing request', statusCode: StatusCodes.INTERNAL_SERVER_ERROR })
    return
  }
  for (const block of await findByHash(hash)) {
    const name = block?._archive
    if (!name) {
      continue
    }
    const archive = await req.app.archiveRepository.get(name)
    // If the archive is public or if the archive is private but this is
    // an auth'd request from the archive owner
    if (isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)) {
      setRawResponseFormat(res)
      res.json({ ...deepOmitUnderscoreFields(block) })
      return
    }
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
}

export const getByHash = asyncHandler(validateUserCanAccessBlock)
