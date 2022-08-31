import { XyoArchive, XyoArchiveKey } from '@xyo-network/api'
import { EntityArchive, User } from '@xyo-network/archivist-model'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Container } from 'inversify'

import { COLLECTIONS } from '../collections'
import { MONGO_TYPES } from '../types'
import { getBaseMongoSdk } from './getBaseMongoSdk'

export const addMongoSdks = (container: Container) => {
  container
    .bind<BaseMongoSdk<Required<XyoArchive>>>(MONGO_TYPES.ArchiveSdkMongo)
    .toConstantValue(getBaseMongoSdk<EntityArchive>(COLLECTIONS.Archives))
  container.bind<BaseMongoSdk<XyoArchiveKey>>(MONGO_TYPES.ArchiveKeySdkMongo).toConstantValue(getBaseMongoSdk<XyoArchiveKey>(COLLECTIONS.ArchiveKeys))
  container
    .bind<BaseMongoSdk<XyoPayloadWithMeta>>(MONGO_TYPES.PayloadSdkMongo)
    .toConstantValue(getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads))
  container
    .bind<BaseMongoSdk<XyoBoundWitnessWithMeta>>(MONGO_TYPES.BoundWitnessSdkMongo)
    .toConstantValue(getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses))
  container.bind<BaseMongoSdk<User>>(MONGO_TYPES.UserSdkMongo).toConstantValue(getBaseMongoSdk<User>(COLLECTIONS.Users))
}
