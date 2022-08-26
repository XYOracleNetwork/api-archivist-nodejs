import 'reflect-metadata'

import { ArchiveSchemaListDiviner } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
class MongoDBArchiveSchemaListDiviner implements ArchiveSchemaListDiviner {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {}
  async find(archive: string): Promise<string[]> {
    return await this.sdk.useCollection((collection) => {
      return collection.distinct('schema', { _archive: archive })
    })
  }
}
export { MongoDBArchiveSchemaListDiviner }
