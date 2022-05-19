import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findByHash, isPublicArchive, isRequestUserOwnerOfArchive } from '../../lib'
import { setRawResponseFormat } from '../../middleware'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

export type HashResponse = Record<string, unknown>

type BlocksLocals = {
  blocks: XyoPayload[]
}

type FoundBlockLocals = BlocksLocals & {
  block?: XyoPayload
}

const validateParams: RequestHandler<HashPathParams> = (req, res, next) => {
  const { hash } = req.params
  if (!hash) {
    next({ message: 'Hash not supplied', statusCode: StatusCodes.BAD_REQUEST })
  }
  next()
}

const validateNotReserved: RequestHandler<HashPathParams> = (req, res, next) => {
  const { hash } = req.params
  // Since this is the default/catch-all route we need to ensure that the
  // request hasn't already been handled by another route
  // NOTE: Remove this if route regex can filter our /archive from matching this route
  if (res.headersSent) {
    return
  } else if (reservedHashes.find((reservedHash) => reservedHash === hash)) {
    console.warn(`This should not happen: ':hash' path did not run: [res.headersSent !== true, reservedHashes did find, ${hash}]`)
    next({ message: 'Error processing request', statusCode: StatusCodes.INTERNAL_SERVER_ERROR })
  }
  next()
}

const validateHashExists: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, BlocksLocals> = async (req, res, next) => {
  const { hash } = req.params
  const blocks = await findByHash(hash)
  if (blocks.length === 0) {
    next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
    return
  }
  res.locals.blocks = blocks
  next()
}

const validateUserCanAccessBlock: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, FoundBlockLocals> = async (req, res, next) => {
  for (const block of res.locals.blocks) {
    const name = block?._archive
    if (!name) {
      continue
    }
    const archive = await req.app.archiveRepository.get(name)
    // If the archive is public or if the archive is private but this is
    // an auth'd request from the archive owner
    if (isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)) {
      res.locals.block = block
      break
    }
  }
  next()
}

const respondWithBlock: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, FoundBlockLocals> = (req, res, next) => {
  const { block } = res.locals
  if (block) {
    setRawResponseFormat(res)
    res.json({ ...deepOmitUnderscoreFields(block) })
  } else {
    next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
  }
  return
}

export const getByHash = [validateParams, validateNotReserved, asyncHandler(validateHashExists), asyncHandler(validateUserCanAccessBlock), respondWithBlock] as RequestHandler[]
