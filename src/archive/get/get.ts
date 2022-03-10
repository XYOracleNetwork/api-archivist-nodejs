import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivesByOwner } from '../../lib'
import { ArchiveResponse } from '../archiveResponse'
import { defaultPublicArchives } from './DefaultPublicArchives'

const getArchivesDistinctByName = (archives: ArchiveResponse[]): ArchiveResponse[] => {
  return archives.reduce((uniques, item) => {
    return uniques.find((existing) => existing.archive === item.archive) ? uniques : [...uniques, item]
  }, [] as ArchiveResponse[])
}

const handler: RequestHandler<NoReqParams, ArchiveResponse[]> = async (req, res, next) => {
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
