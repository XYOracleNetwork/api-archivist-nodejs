import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveBoundWitnessesArchivist,
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
import { MongoDBArchiveBoundWitnessesArchivist } from './ArchiveBoundWitnesses'
import { MongoDBArchivePayloadsArchivist } from './ArchivePayloads'

/**
 * The number of most recently used archive archivists to keep
 * in the cache
 */
const max = 1000

let boundWitnessArchivists: LruCache<string, ArchiveBoundWitnessesArchivist> | undefined = undefined
let payloadArchivists: LruCache<string, ArchivePayloadsArchivist> | undefined = undefined

export const addArchivistFactories = (container: Container) => {
  boundWitnessArchivists = new LruCache<string, ArchiveBoundWitnessesArchivist>({ max })
  payloadArchivists = new LruCache<string, ArchivePayloadsArchivist>({ max })

  container
    .bind<interfaces.Factory<ArchiveBoundWitnessesArchivist>>(TYPES.ArchiveBoundWitnessesArchivistFactory)
    .toFactory<ArchiveBoundWitnessesArchivist, [string]>((context) => {
      return (archive: string) => {
        const cached = boundWitnessArchivists?.get?.(archive)
        if (cached) return cached
        const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
        const account = context.container.get<XyoAccount>(TYPES.Account)
        const sdk = context.container.get<BaseMongoSdk<XyoBoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdkMongo)
        const archivist = new MongoDBArchiveBoundWitnessesArchivist(account, sdk, config)
        boundWitnessArchivists?.set(archive, archivist)
        return archivist
      }
    })
  container
    .bind<interfaces.Factory<ArchivePayloadsArchivist>>(TYPES.ArchivePayloadsArchivistFactory)
    .toFactory<ArchivePayloadsArchivist, [string]>((context) => {
      return (archive: string) => {
        const cached = payloadArchivists?.get?.(archive)
        if (cached) return cached
        const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
        const account = context.container.get<XyoAccount>(TYPES.Account)
        const sdk = context.container.get<BaseMongoSdk<XyoPayloadWithMeta>>(MONGO_TYPES.PayloadSdkMongo)
        const archivist = new MongoDBArchivePayloadsArchivist(account, sdk, config)
        payloadArchivists?.set(archive, archivist)
        return archivist
      }
    })
}
