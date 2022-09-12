import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { migrateLegacyArchives } from '../migrateLegacyArchives'

const handler: RequestHandler<ArchivePathParams> = async (req, res, next) => {
  const { archive } = req.params
  const { archivePermissionsArchivist, archiveArchivist } = req.app
  const result = await archiveArchivist.get([archive])
  const entity = result.pop()
  if (entity) {
    const result = await migrateLegacyArchives(archivePermissionsArchivist, [entity])
    const migrated = result?.[0]
    res.status(StatusCodes.OK).json({ archive: entity, migrated })
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const postMigratePermissionsArchive = asyncHandler(handler)
