import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getBaseMongoSdk } from '../../../../lib'
import { ArchivePathParams } from '../../../../model'
import { migrateLegacyArchives } from '../migrateLegacyArchives'

const getArchive = (archive: string): Promise<XyoArchive | null> => {
  const sdk = getBaseMongoSdk<XyoArchive>('archives')
  return sdk.findOne({ archive })
}

const handler: RequestHandler<ArchivePathParams> = async (req, res, next) => {
  const { archive } = req.params
  const { archivePermissionsRepository } = req.app
  const entity = await getArchive(archive)
  if (entity) {
    const result = await migrateLegacyArchives(archivePermissionsRepository, [entity])
    const migrated = result?.[0]
    res.status(StatusCodes.OK).json({ archive: entity, migrated })
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const postMigratePermissionsArchive = asyncHandler(handler)
