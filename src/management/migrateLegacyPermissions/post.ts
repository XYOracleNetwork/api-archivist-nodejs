import { asyncHandler, NoReqBody, NoReqParams, NoReqQuery, NoResBody, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getBaseMongoSdk, isLegacyPrivateArchive } from '../../lib'
import { ArchivePermissionsRepository, SetArchivePermissions, setArchivePermissionsSchema } from '../../model'

export interface MigrateQueryParams extends NoReqQuery {
  limit: string
  offset: string
}

const schema = setArchivePermissionsSchema
const defaultLimit = 200
const defaultOffset = 0

const publicArchivePermissions: SetArchivePermissions = {
  schema,
}

const privateArchivePermissions: SetArchivePermissions = {
  allow: {
    addresses: [],
  },
  schema,
}

const getArchives = async (limit: number, offset: number): Promise<XyoArchive[]> => {
  const sdk = getBaseMongoSdk<XyoArchive>('archives')
  return (await sdk.find({})).sort({ _id: -1 }).skip(offset).limit(limit).toArray()
}

// TODO: Witness each record by Archivist?
const migrateArchives = async (repository: ArchivePermissionsRepository, archives: XyoArchive[]) => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissions = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return repository.insert([permissions])
  })
  const results = await Promise.all(migrations)
  return results.map((result) => result?.[0])
}

const handler: RequestHandler<NoReqParams, NoResBody, NoReqBody, MigrateQueryParams> = async (req, res, next) => {
  const { limit, offset } = req.query
  const { archivePermissionsRepository } = req.app
  const parsedLimit = tryParseInt(limit) || defaultLimit
  const parsedOffset = tryParseInt(offset) || defaultOffset
  const archives = await getArchives(parsedLimit, parsedOffset)
  const archiveCount = archives.length
  const migrated = await migrateArchives(archivePermissionsRepository, archives)
  const migratedCount = migrated.filter(exists).length
  res.status(StatusCodes.OK).json({ archiveCount, migratedCount })
  next()
}

export const postMigrateLegacyArchivePermissions = asyncHandler(handler)
