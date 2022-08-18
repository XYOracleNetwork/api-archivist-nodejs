import { assertEx } from '@xylabs/sdk-js'
import { ArchivePayloadsArchivist, ArchivePayloadsArchivistId, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchivePayloadsArchivist implements ArchivePayloadsArchivist {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {}
  async find(predicate: XyoArchivePayloadFilterPredicate<Partial<XyoPayloadWithMeta>>): Promise<XyoPayloadWithMeta[]> {
    const { archive, limit, order, ...props } = predicate
    const sortOrder = order || 'desc'
    const parsedLimit = limit || 20
    const filter = {
      ...props,
      _archive: archive,
    }
    return (await this.sdk.find(filter)).sort({ _timestamp: sortOrder }).limit(parsedLimit).toArray()
  }
  async get(id: ArchivePayloadsArchivistId): Promise<XyoPayloadWithMeta[]> {
    const predicate = { _archive: assertEx(id.archive), _hash: assertEx(id.hash) }
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
