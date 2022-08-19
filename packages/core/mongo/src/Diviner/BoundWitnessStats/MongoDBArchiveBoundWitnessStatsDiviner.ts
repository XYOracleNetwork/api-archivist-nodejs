import 'reflect-metadata'

import { XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner {
  constructor(@inject(MONGO_TYPES.BoundWitnessSdkMongo) protected sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>) {}
}
