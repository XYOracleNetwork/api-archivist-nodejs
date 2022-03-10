import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { removeUnderscoreFields } from '@xyo-network/sdk-xyo-client-js'
import { Request, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ArchiveLocals } from '../../archive'
import { ArchiveResult, findByHash, getArchiveByName } from '../../lib'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

export type HashResponse = Record<string, unknown>

const isPublicArchive = (archive?: ArchiveResult | null): boolean => {
  return !archive ? false : !archive.accessControl
}

const isReqUserArchiveOwner = (req: Request, archive: ArchiveResult): boolean => {
  const archiveOwnerId = archive?.user
  if (!archiveOwnerId) {
    console.log(`No Archive Owner: ${JSON.stringify(archive, null, 2)}`)
    return false
  }
  // Grab the user from the request (if this was an auth'd request)
  const reqUserId = req?.user?.id
  if (!reqUserId) return false

  return reqUserId === archiveOwnerId
}

const handler: RequestHandler<HashPathParams, HashResponse, NoReqBody, NoReqQuery, ArchiveLocals> = async (
  req,
  res,
  next
) => {
  const { hash } = req.params
  if (!hash) {
    next({ message: 'Hash not supplied', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  // Since this is the default/catch-all route we need to ensure that the
  // request hasn't already been handled by another route
  // NOTE: Remove this if route regex can filter our /archive from matching this route
  if (res.headersSent) {
    next()
    return
  }

  if (reservedHashes.find((reservedHash) => reservedHash === hash)) {
    console.warn(
      `This should not happen: ':hash' path did not run: [res.headersSent !== true, reservedHashes did find, ${hash}]`
    )
    next()
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
    // If the archive is public
    if (isPublicArchive(archive)) {
      // return this block from the public archive
      res.json({ ...removeUnderscoreFields(block) })
      next()
      return
    } else if (isReqUserArchiveOwner(req, archive)) {
      // If the archive is private but this is an auth'd
      // request from the archive owner
      // return this block from the private archive
      res.json({ ...removeUnderscoreFields(block) })
      next()
      return
    }
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
  return
}

export const getByHash = asyncHandler(handler)
