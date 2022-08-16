import { assertEx } from '@xylabs/sdk-js'
import { ArchivePayloadsArchivist, ArchivePayloadsArchivistId } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchivePayloadArchivist implements ArchivePayloadsArchivist {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {}
  async find(filter: Filter<XyoPayloadWithMeta>): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find(filter)).limit(100).toArray()
  }
  async get(id: ArchivePayloadsArchivistId): Promise<XyoPayloadWithMeta[]> {
    const predicate = { _hash: assertEx(id.hash), archive: assertEx(id.archive) }
    return (await this.sdk.find(predicate)).limit(1).toArray()
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
