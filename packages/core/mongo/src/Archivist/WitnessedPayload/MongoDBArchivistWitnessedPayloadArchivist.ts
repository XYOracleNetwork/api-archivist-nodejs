import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoPayloadFindFilter } from '@xyo-network/archivist'
import {
  AbstractPayloadArchivist,
  WitnessedPayloadArchivist,
  XyoBoundWitnessWithMeta,
  XyoPayloadWithMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable, named } from 'inversify'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

const unique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index
}

@injectable()
export class MongoDBArchivistWitnessedPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta> implements WitnessedPayloadArchivist {
  constructor(
    @inject(TYPES.Account) @named('root') protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<XyoPayloadWithMeta>,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super(account)
  }
  find(_filter: XyoPayloadFindFilter): Promise<XyoPayloadWithMeta[]> {
    throw new Error('Not implemented')
  }
  async get(hashes: string[]): Promise<XyoPayloadWithMeta[]> {
    // Find bw signed by us that has this hash
    const hash = assertEx(hashes.pop(), 'Missing hash')
    const bound_witnesses = await (await this.boundWitnesses.find({ payload_hashes: hash })).limit(100).toArray()
    const archives = bound_witnesses
      .map((bw) => bw._archive)
      .filter(exists)
      .filter(unique)
    return (await this.payloads.find({ _archive: { $in: archives }, _hash: hash })).limit(100).toArray()
  }

  async insert(payloads: XyoPayloadWithMeta[]): Promise<XyoBoundWitness[]> {
    // Witness from archivist
    const _timestamp = Date.now()
    const bw = new BoundWitnessBuilder({ inlinePayloads: false }).payloads(payloads).build() as XyoBoundWitnessWithMeta & XyoPayloadWithPartialMeta
    bw._timestamp = _timestamp
    const witnessResult = await this.boundWitnesses.insertOne(bw)
    if (!witnessResult.acknowledged || !witnessResult.insertedId) {
      throw new Error('Error inserting BoundWitness')
    }
    // Store payloads
    const result = await this.payloads.insertMany(payloads.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != payloads.length) {
      throw new Error('Error inserting Payloads')
    }
    return [bw]
  }
}
