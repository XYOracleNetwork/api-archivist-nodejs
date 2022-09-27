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

import { MONGO_TYPES } from '../types'
import { MongoDBArchiveBoundWitnessesArchivist } from './ArchiveBoundWitnesses'
import { MongoDBArchivePayloadsArchivist } from './ArchivePayloads'

export const addArchivistFactories = (container: Container) => {
  container
    .bind<interfaces.Factory<ArchivePayloadsArchivist>>(TYPES.ArchivePayloadsArchivistFactory)
    .toFactory<ArchivePayloadsArchivist, [string]>((context) => {
      return (archive: string) => {
        const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
        const account = context.container.get<XyoAccount>(TYPES.Account)
        const sdk = context.container.get<BaseMongoSdk<XyoPayloadWithMeta>>(MONGO_TYPES.PayloadSdkMongo)
        return new MongoDBArchivePayloadsArchivist(account, sdk, config)
      }
    })
  container
    .bind<interfaces.Factory<ArchiveBoundWitnessesArchivist>>(TYPES.ArchiveBoundWitnessesArchivistFactory)
    .toFactory<ArchiveBoundWitnessesArchivist, [string]>((context) => {
      return (archive: string) => {
        const config: ArchiveModuleConfig = { archive, schema: XyoModuleConfigSchema }
        const account = context.container.get<XyoAccount>(TYPES.Account)
        const sdk = context.container.get<BaseMongoSdk<XyoBoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdkMongo)
        return new MongoDBArchiveBoundWitnessesArchivist(account, sdk, config)
      }
    })
}
