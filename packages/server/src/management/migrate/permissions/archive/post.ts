import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { migrateLegacyArchives } from '../migrateLegacyArchives'

const getArchive = (archive: string): Promise<XyoArchive | null> => {
  const sdk = dependencies.get<BaseMongoSdk<XyoArchive>>(TYPES.ArchiveSdkMongo)
  return sdk.findOne({ archive })
}

const handler: RequestHandler<ArchivePathParams> = async (req, res, next) => {
  const { archive } = req.params
  const { archivePermissionsArchivist } = req.app
  const entity = await getArchive(archive)
  if (entity) {
    const result = await migrateLegacyArchives(archivePermissionsArchivist, [entity])
    const migrated = result?.[0]
    res.status(StatusCodes.OK).json({ archive: entity, migrated })
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const postMigratePermissionsArchive = asyncHandler(handler)