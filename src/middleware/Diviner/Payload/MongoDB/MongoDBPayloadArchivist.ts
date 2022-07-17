import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import { TYPES } from '../../../../Dependencies'
import { removeId } from '../../../../lib'
import { AbstractPayloadArchivist } from '../../../../model'

@injectable()
export class MongoDBPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta, string, Filter<XyoPayloadWithMeta>> {
  constructor(@inject(TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {
    super()
  }
  async find(filter: Filter<XyoPayloadWithMeta>): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find(filter)).toArray()
  }
  async get(hash: string): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).toArray()
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
