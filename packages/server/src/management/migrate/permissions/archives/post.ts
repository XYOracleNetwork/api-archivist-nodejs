import { asyncHandler, NoReqBody, NoReqParams, NoReqQuery, NoResBody, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { migrateLegacyArchives } from '../migrateLegacyArchives'

export interface MigrateQueryParams extends NoReqQuery {
  limit: string
  offset: string
}

const defaultLimit = 200
const defaultOffset = 0

const getArchives = async (limit: number, offset: number): Promise<XyoArchive[]> => {
  const sdk = dependencies.get<BaseMongoSdk<XyoArchive>>(TYPES.ArchiveSdkMongo)
  return (await sdk.find({})).sort({ _id: -1 }).skip(offset).limit(limit).toArray()
}

const handler: RequestHandler<NoReqParams, NoResBody, NoReqBody, MigrateQueryParams> = async (req, res) => {
  const { limit, offset } = req.query
  const { archivePermissionsArchivist } = req.app
  const parsedLimit = tryParseInt(limit) || defaultLimit
  const parsedOffset = tryParseInt(offset) || defaultOffset
  const archives = await getArchives(parsedLimit, parsedOffset)
  const archiveCount = archives.length
  const migrated = await migrateLegacyArchives(archivePermissionsArchivist, archives)
  const migratedCount = migrated.filter(exists).length
  res.status(StatusCodes.OK).json({ archiveCount, migratedCount })
}

export const postMigratePermissionsArchives = asyncHandler(handler)
