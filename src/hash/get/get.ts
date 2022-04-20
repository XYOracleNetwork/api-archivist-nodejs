import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { deepOmitUnderscoreFields, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { findByHash, getArchiveByName, isPublicArchive, isRequestUserOwnerOfArchive } from '../../lib'
import { setRawResponseFormat } from '../../middleware'
import { ArchiveLocals } from '../../model'
import { WithValid } from './WithValid'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

export type HashResponse = Record<string, unknown>

const respondWithBlock = (res: Response, block: XyoPayload) => {
  setRawResponseFormat(res)
  res.json({ ...deepOmitUnderscoreFields(block) })
}

const validate: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, WithValid<ArchiveLocals>> = (req, res, next) => {
  const { hash } = req.params
  if (!hash) {
    next({ message: 'Hash not supplied', statusCode: StatusCodes.BAD_REQUEST })
    res.locals.valid = false
    return
  }

  // Since this is the default/catch-all route we need to ensure that the
  // request hasn't already been handled by another route
  // NOTE: Remove this if route regex can filter our /archive from matching this route
  if (res.headersSent) {
    next()
    res.locals.valid = false
    return
  }

  if (reservedHashes.find((reservedHash) => reservedHash === hash)) {
    console.warn(`This should not happen: ':hash' path did not run: [res.headersSent !== true, reservedHashes did find, ${hash}]`)
    next()
    res.locals.valid = false
    return
  }
  res.locals.valid = true
}

const handler: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, WithValid<ArchiveLocals>> = async (req, res, next) => {
  const { hash } = req.params
  validate(req, res, next)
  if (!res.locals.valid) {
    return
  }

  const blocks = await findByHash(hash)
  if (blocks.length === 0) {
    next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
    return
  }

  for (const block of blocks) {
    if (!block?._archive) {
      console.log(`No Archive For Block: ${JSON.stringify(block, null, 2)}`)
      continue
    }
    const archive = await getArchiveByName(block._archive)
    if (!archive) {
      console.log(`No Archive By Name: ${JSON.stringify(block, null, 2)}`)
      continue
    }
    // If the archive is public or if the archive is private but this is
    // an auth'd request from the archive owner
    if (isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)) {
      respondWithBlock(res, block)
      next()
      return
    }
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
  return
}

export const getByHash = asyncHandler(handler)
