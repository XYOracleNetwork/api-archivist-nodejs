import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { getArchivesByOwner } from '../../lib'
import { defaultPublicArchives } from './DefaultPublicArchives'

const getArchivesDistinctByName = (archives: XyoArchive[]): XyoArchive[] => {
  // Use a Map with the archive name as the key to produce an array
  // of distinct archives. If there are duplicates, the last occurrence
  // of the archive in the supplied array will be the one that is used.
  return [...new Map(archives.map((x) => [x.archive, x])).values()]
}

const handler: RequestHandler<NoReqParams, XyoArchive[]> = async (req, res, next) => {
  const id = req?.user?.id
  if (!id) {
    res.json(defaultPublicArchives)
  } else {
    const userArchives = await getArchivesByOwner(id)
    res.json(getArchivesDistinctByName([...defaultPublicArchives, ...userArchives]))
  }
  next()
}

export const getArchives = asyncHandler(handler)
