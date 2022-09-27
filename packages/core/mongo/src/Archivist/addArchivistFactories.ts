import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveBoundWitnessArchivist,
  ArchiveModuleConfig,
  ArchivePayloadsArchivist,
  XyoBoundWitnessWithMeta,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoModuleConfigSchema } from '@xyo-network/module'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Container, interfaces } from 'inversify'
import LruCache from 'lru-cache'

import { MONGO_TYPES } from '../types'
import { MongoDBArchiveBoundWitnessArchivist } from './ArchiveBoundWitness'
import { MongoDBArchivePayloadsArchivist } from './ArchivePayloads'

/**
 * The number of most recently used archive archivists to keep
 * in the cache
 */
const max = 1000

let boundWitnessArchivistCache: LruCache<string, ArchiveBoundWitnessArchivist> | undefined = undefined
let payloadArchivistCache: LruCache<string, ArchivePayloadsArchivist> | undefined = undefined

export type ArchiveBoundWitnessArchivistFactory = interfaces.Factory<ArchiveBoundWitnessArchivist>
export type ArchivePayloadArchivistFactory = interfaces.Factory<ArchivePayloadsArchivist>

export const addArchivistFactories = (container: Container) => {
  boundWitnessArchivistCache = new LruCache<string, ArchiveBoundWitnessArchivist>({ max })
  payloadArchivistCache = new LruCache<string, ArchivePayloadsArchivist>({ max })

  container
    .bind<ArchiveBoundWitnessArchivistFactory>(TYPES.ArchiveBoundWitnessArchivistFactory)
    .toFactory<ArchiveBoundWitnessArchivist, [string]>((context) => {
      return (archive: string) => getBoundWitnessArchivist(context, archive)
    })
  container.bind<ArchivePayloadArchivistFactory>(TYPES.ArchivePayloadArchivistFactory).toFactory<ArchivePayloadsArchivist, [string]>((context) => {
    return (archive: string) => getPayloadArchivist(context, archive)
  })
}

const getBoundWitnessArchivist = (context: interfaces.Context, archive: string) => {
  const cached = boundWitnessArchivistCache?.get?.(archive)
  if (cached) return cached
  const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
  const account = context.container.get<XyoAccount>(TYPES.Account)
  const sdk = context.container.get<BaseMongoSdk<XyoBoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdkMongo)
  const archivist = new MongoDBArchiveBoundWitnessArchivist(account, sdk, config)
  boundWitnessArchivistCache?.set(archive, archivist)
  return archivist
}

const getPayloadArchivist = (context: interfaces.Context, archive: string) => {
  const cached = payloadArchivistCache?.get?.(archive)
  if (cached) return cached
  const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
  const account = context.container.get<XyoAccount>(TYPES.Account)
  const sdk = context.container.get<BaseMongoSdk<XyoPayloadWithMeta>>(MONGO_TYPES.PayloadSdkMongo)
  const archivist = new MongoDBArchivePayloadsArchivist(account, sdk, config)
  payloadArchivistCache?.set(archive, archivist)
  return archivist
}
