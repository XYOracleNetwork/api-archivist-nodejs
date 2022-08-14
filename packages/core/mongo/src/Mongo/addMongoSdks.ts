import { EntityArchive, User } from '@xyo-network/archivist-model'
import { XyoArchive, XyoArchiveKey, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Container } from 'inversify'

import { MONGO_TYPES } from '../types'
import { getBaseMongoSdk } from '.'

export const addMongoSdks = (container: Container) => {
  container.bind<BaseMongoSdk<Required<XyoArchive>>>(MONGO_TYPES.ArchiveSdkMongo).toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
  container.bind<BaseMongoSdk<XyoArchiveKey>>(MONGO_TYPES.ArchiveKeySdkMongo).toConstantValue(getBaseMongoSdk<XyoArchiveKey>('archive_keys'))
  container.bind<BaseMongoSdk<XyoPayloadWithMeta>>(MONGO_TYPES.PayloadSdkMongo).toConstantValue(getBaseMongoSdk<XyoPayloadWithMeta>('payloads'))
  container
    .bind<BaseMongoSdk<XyoBoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdkMongo)
    .toConstantValue(getBaseMongoSdk<XyoBoundWitnessWithMeta>('bound_witnesses'))
  container.bind<BaseMongoSdk<User>>(MONGO_TYPES.UserSdkMongo).toConstantValue(getBaseMongoSdk<User>('users'))
}
