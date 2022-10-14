import 'reflect-metadata'

import { exists } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import {
  AddressHistoryDiviner,
  AddressHistoryQueryPayload,
  isAddressHistoryQueryPayload,
  XyoBoundWitnessWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import { DefaultMaxTimeMS } from '../../defaults'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBAddressHistoryDiviner extends XyoDiviner implements AddressHistoryDiviner, JobProvider {
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
      //   name: 'MongoDBAddressHistoryDiviner.DivineBatch',
      //   schedule: '10 minute',
      //   task: async () => await this.divineArchivesBatch(),
      // },
    ]
  }

  override async divine(payloads?: XyoPayloads): Promise<XyoPayloads<XyoBoundWitness>> {
    const query = payloads?.find<AddressHistoryQueryPayload>(isAddressHistoryQueryPayload)
    // TODO: Support multiple queries
    if (!query) return []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { address, schema, limit, offset, order, ...props } = query
    const filter: Filter<XyoBoundWitnessWithMeta> = {}
    if (address) filter.addresses = { $in: ([] as string[]).concat(address) }
    if (offset) filter._hash === offset
    const mostRecentBlockByAddress = await (await this.sdk.find(filter)).sort({ _timestamp: -1 }).limit(1).maxTimeMS(DefaultMaxTimeMS).toArray()
    // TODO: Walk chain backwards
    return mostRecentBlockByAddress
  }

  override async initialize(): Promise<void> {
    // await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    // await this.changeStream?.close()
  }
}

const concatArrays = (a: string | string[] | undefined, b: string | string[] | undefined): string[] => {
  return ([] as (string | undefined)[])
    .concat(a)
    .concat(b)
    .filter(exists)
    .map((x) => x.toLowerCase())
    .map((x) => (x.startsWith('0x') ? x.substring(2) : x))
}
