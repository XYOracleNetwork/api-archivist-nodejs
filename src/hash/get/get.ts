/* eslint-disable max-statements */
import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { removeUnderscoreFields } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ArchiveLocals } from '../../archive'
import { ArchiveResult, findByHash, getArchiveByName } from '../../lib'

const reservedHashes = ['archive', 'schema', 'doc', 'domain']

export type HashPathParams = {
  hash: string
}

export type HashResponse = Record<string, unknown>

export const isPublicArchive = (archive?: ArchiveResult | null): boolean => {
  if (!archive) return false
  return archive ? !archive.accessControl : false
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

  // Grab the user from the request if this was an auth'd request
  const userId = req?.user?.id

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
    // If archive is public
    if (isPublicArchive(archive)) {
      // Return this block to the user
      res.json({ ...removeUnderscoreFields(block) })
      return
    } else if (userId) {
      // Since the archive is private, check if the user owns archive
      const ownerId = archive?.user
      if (ownerId) {
        console.log(`No Archive Owner: ${JSON.stringify(archive, null, 2)}`)
        continue
      }
      // If the user owns the archive
      if (ownerId === userId) {
        // Return this block to the user
        res.json({ ...removeUnderscoreFields(block) })
        return
      }
    }
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
  return
}

export const getByHash = asyncHandler(handler)
