import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
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

import { DefaultLimit, DefaultMaxTimeMS } from '../../defaults'
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
    const addresses = sanitizeAddress(address)
    assertEx(addresses, 'MongoDBAddressHistoryDiviner: Missing address for query')
    assertEx(typeof offset === 'string', 'MongoDBAddressHistoryDiviner: Supplied offset must be a hash')
    const hash: string = offset as string
    return await this.getBlocks(hash, addresses, limit || DefaultLimit)
  }

  override async initialize(): Promise<void> {
    // await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    // await this.changeStream?.close()
  }

  private getBlocks = async (hash: string, address: string, limit: number): Promise<XyoBoundWitnessWithMeta[]> => {
    let nextHash = hash
    const blocks: XyoBoundWitnessWithMeta[] = []
    for (let i = 0; i < limit; i++) {
      const block = (
        await (await this.sdk.find({ _hash: nextHash, addresses: address })).sort({ _timestamp: -1 }).limit(1).maxTimeMS(DefaultMaxTimeMS).toArray()
      ).pop()
      if (!block) break
      blocks.push(block)
      const addressIndex = block.addresses.findIndex((value) => value === address)
      const previousHash = block.previous_hashes[addressIndex]
      if (!previousHash) break
      nextHash = previousHash
    }
    return blocks
  }
}

const sanitizeAddress = (a: string | string[] | undefined): string => {
  return ([] as (string | undefined)[])
    .concat(a)
    .filter(exists)
    .map((x) => x.toLowerCase())
    .map((x) => (x.startsWith('0x') ? x.substring(2) : x))
    .reduce((x) => x)
}
