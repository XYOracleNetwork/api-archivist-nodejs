import { WithXyoPayloadMeta, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getArchivistAllPayloadMongoSdk } from '../../lib'
import { PayloadRepository } from './payloadRepository'

export class MongoDBPayloadRepository implements PayloadRepository<XyoPayload, Filter<XyoPayload>> {
  constructor(private sdk: BaseMongoSdk<XyoPayload> = getArchivistAllPayloadMongoSdk()) {}
  find(query: Filter<XyoPayload>): Promise<WithXyoPayloadMeta<XyoPayload>[]> {
    throw new Error('Method not implemented.')
  }
  get(id: string): Promise<WithXyoPayloadMeta<XyoPayload>[]> {
    throw new Error('Method not implemented.')
  }
  insert(item: any): Promise<WithXyoPayloadMeta<XyoPayload>> {
    throw new Error('Method not implemented.')
  }
}
