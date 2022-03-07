import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { removeUnderscoreFields } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ArchiveLocals } from '../../archive'
import { ArchiveResult, getArchiveByName } from '../../lib'
import { findByHash } from './findByHash'

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

  const block = await findByHash(hash)
  if (!block) {
    next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
    return
  }
  if (!block?._archive) {
    next({ message: 'Archive not found for block', statusCode: StatusCodes.NOT_FOUND })
    return
  }
  const archive = await getArchiveByName(block._archive)
  if (!archive) {
    next({ message: 'Archive not found for block', statusCode: StatusCodes.NOT_FOUND })
    return
  }

  // If archive is public
  if (isPublicArchive(archive)) {
    // Return the block
    res.json({ ...removeUnderscoreFields(block) })
    return
  } else {
    // If the archive is private check if the user owns archive
    const { user } = req
    if (!user || !user?.id) {
      next({ message: 'Invalid User', statusCode: StatusCodes.NOT_FOUND })
      return null
    }
    if (!archive?.user) {
      next({ message: 'Archive owner not found', statusCode: StatusCodes.NOT_FOUND })
      return
    }
    // If the user owns the archive
    if (user.id === archive.user) {
      // Return the block
      res.json({ ...removeUnderscoreFields(block) })
      return
    }
  }
  next({ message: 'Hash not found', statusCode: StatusCodes.NOT_FOUND })
  return
}

export const getByHash = asyncHandler(handler)
