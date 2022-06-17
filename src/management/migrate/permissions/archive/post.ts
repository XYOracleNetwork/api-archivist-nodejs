import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getBaseMongoSdk } from '../../../../lib'
import { migrateLegacyArchives } from '../migrateLegacyArchives'

export interface MigratePathParams extends NoReqParams {
  archive: string
}

const getArchive = (archive: string): Promise<XyoArchive | null> => {
  const sdk = getBaseMongoSdk<XyoArchive>('archives')
  return sdk.findOne({ archive })
}

const handler: RequestHandler<MigratePathParams> = async (req, res, next) => {
  const { archive } = req.params
  const { archivePermissionsRepository } = req.app
  const entity = await getArchive(archive)
  if (entity) {
    const migrated = await migrateLegacyArchives(archivePermissionsRepository, [entity])
    res.status(StatusCodes.OK).json({ archive: entity, migrated })
  } else {
    res.status(StatusCodes.NOT_FOUND)
  }
  next()
}

export const postMigratePermissionsArchive = asyncHandler(handler)
