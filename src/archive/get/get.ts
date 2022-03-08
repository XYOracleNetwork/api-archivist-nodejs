import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivesByOwner } from '../../lib'
import { ArchiveResponse } from '../archiveResponse'
import { defaultPublicArchives } from './DefaultPublicArchives'

const handler: RequestHandler<NoReqParams, ArchiveResponse[]> = async (req, res, next) => {
  const id = req?.user?.id
  if (!id) {
    res.json(defaultPublicArchives)
  } else {
    const userArchives = await getArchivesByOwner(id)
    res.json([...defaultPublicArchives, ...userArchives])
  }
  next()
}

export const getArchives = asyncHandler(handler)
