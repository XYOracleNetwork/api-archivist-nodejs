import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount, XyoBoundWitnessBuilder, XyoPayloadBuilder, XyoSchemaCache, XyoSchemaCacheEntry } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { v1 } from 'uuid'

import { getArchivistBoundWitnessesMongoSdk } from '../../../../../lib'
import { ArchivePathParams } from '../../../../../model'

const schema = 'network.xyo.schema.cache.witness'

// TODO: Get via DI or static access so we can abstract away locality of
// Account access since it won't always be local to the archivist
// NOTE: We'll want to move to a distributed account that can be shared
// among multiple archivists so that we can maintain a consistent chain
// when running multiple networked archivists
/**
 * Create an Account we'll use to witness each request with during the
 * lifetime of the program
 */
const address = XyoAccount.fromPhrase(v1())

const getAllCachedSchema = async (): Promise<XyoSchemaCacheEntry[]> => {
  // TODO: Enumerate all keys/entries within the schema cache
  // and potentially filter out by just schema in this archive
  await XyoSchemaCache.instance.get('')
  return [] as XyoSchemaCacheEntry[]
}

const exists = (x: string | undefined): x is string => {
  return !!x
}

const witnessCurrentSchemaInArchive = async (archive: string) => {
  const schemas = await getAllCachedSchema()
  const hashes = schemas.map((schema) => schema.payload._hash).filter(exists)
  const body = { schemas: hashes }
  const payload = new XyoPayloadBuilder({ schema }).fields(body).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payload(payload).build()
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.insert(bw)
}

const handler: RequestHandler<ArchivePathParams> = async (req, res, next) => {
  const { archive } = req.params
  assertEx(archive, 'archive must be supplied')
  const schemas = (await witnessCurrentSchemaInArchive(archive)) || []
  res.json(schemas)
  next()
}

export const postArchiveSchemaCurrentWitness = asyncHandler(handler)
