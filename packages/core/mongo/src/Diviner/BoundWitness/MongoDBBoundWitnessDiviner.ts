import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import { BoundWitnessDiviner, BoundWitnessQueryPayload, isBoundWitnessQueryPayload, XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { DefaultLimit, DefaultMaxTimeMS, DefaultOrder } from '../../defaults'
import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBBoundWitnessDiviner extends XyoDiviner implements BoundWitnessDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      // {
      //   name: 'MongoDBBoundWitnessDiviner.DivineBatch',
      //   schedule: '10 minute',
      //   task: async () => await this.divineArchivesBatch(),
      // },
    ]
  }

  override async divine(payloads?: XyoPayloads): Promise<XyoPayloads<XyoBoundWitness>> {
    const query = payloads?.find<BoundWitnessQueryPayload>(isBoundWitnessQueryPayload)
    // TODO: Support multiple queries
    if (!query) return []
    const {
      archive,
      archives,
      addresses,
      hash,
      limit,
      order,
      payload_hashes,
      payload_schemas,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      schema,
      timestamp,
      ...props
    } = query
    const parsedLimit = limit || DefaultLimit
    const parsedOrder = order || DefaultOrder
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const filter: Filter<XyoBoundWitnessWithMeta> = { ...props }
    if (timestamp) {
      const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
      filter._timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    }
    if (archive) filter._archive = archive
    if (archives?.length) filter._archive = { $in: archives }
    if (hash) filter._hash = hash
    // NOTE: Defaulting to $all since it makes the most sense when singing addresses are supplied
    // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
    // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
    // potentially impacting performance for all single-address queries
    if (addresses?.length) filter.addresses = { $all: addresses }
    if (payload_hashes?.length) filter.payload_hashes = { $in: payload_hashes }
    if (payload_schemas?.length) filter.payload_schemas = { $in: payload_schemas }
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(removeId)
  }

  override async initialize(): Promise<void> {
    // await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    // await this.changeStream?.close()
  }
}
