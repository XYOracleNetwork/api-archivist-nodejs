import 'reflect-metadata'

import { ArchiveSchemaListDiviner } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveSchemaListDiviner implements ArchiveSchemaListDiviner {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {}
  async find(archive: string): Promise<Array<string[]>> {
    const result = await this.sdk.useCollection((collection) => {
      return collection.distinct('schema', { _archive: archive })
    })
    return [result]
  }
}
