import { EntityArchive, User } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchive, XyoArchiveKey, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Container } from 'inversify'

import { getBaseMongoSdk } from './dbSdk'

export const addMongo = (container: Container) => {
  container.bind<BaseMongoSdk<Required<XyoArchive>>>(TYPES.ArchiveSdkMongo).toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
  container.bind<BaseMongoSdk<XyoArchiveKey>>(TYPES.ArchiveKeySdkMongo).toConstantValue(getBaseMongoSdk<XyoArchiveKey>('archive_keys'))
  container.bind<BaseMongoSdk<XyoPayloadWithMeta>>(TYPES.PayloadSdkMongo).toConstantValue(getBaseMongoSdk<XyoPayloadWithMeta>('payloads'))
  container
    .bind<BaseMongoSdk<XyoBoundWitnessWithMeta>>(TYPES.BoundWitnessSdkMongo)
    .toConstantValue(getBaseMongoSdk<XyoBoundWitnessWithMeta>('bound_witnesses'))
  container.bind<BaseMongoSdk<User>>(TYPES.UserSdkMongo).toConstantValue(getBaseMongoSdk<User>('users'))
}
