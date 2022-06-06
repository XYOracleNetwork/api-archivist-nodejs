import { exists } from '@xylabs/sdk-js'
import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getBaseMongoSdk } from '../../../../lib'
import { AbstractPayloadRepository } from '../../../../model'

const unique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index
}

export class MongoDBArchivistWitnessedPayloadRepository extends AbstractPayloadRepository<XyoPayload, string, Filter<XyoPayload>> {
  constructor(
    protected account: XyoAccount,
    protected payloads: BaseMongoSdk<XyoPayload> = getBaseMongoSdk<XyoPayload>('payloads'),
    protected boundWitnesses: BaseMongoSdk<XyoBoundWitness> = getBaseMongoSdk<XyoBoundWitness>('bound_witnesses')
  ) {
    super()
  }
  find(_filter: Filter<XyoPayload>): Promise<XyoPayload[]> {
    throw new Error('Not implemented')
    // TODO: How to support filtering but add our own filter in aggregation
  }
  async get(hash: string): Promise<XyoPayload[]> {
    // Find bw signed by us that has this hash
    const bound_witnesses = await (await this.boundWitnesses.find({ payload_hashes: hash })).toArray()
    const archives = bound_witnesses
      .map((bw) => bw._archive)
      .filter(exists)
      .filter(unique)
    return (await this.payloads.find({ _archive: { $in: archives }, _hash: hash })).toArray()
  }
  async insert(payloads: XyoPayload[]): Promise<XyoPayload[]> {
    // Witness from archivist
    const bw = new XyoBoundWitnessBuilder({ inlinePayloads: false }).payloads(payloads).build()
    const witnessResult = await this.boundWitnesses.insertOne(bw)
    if (!witnessResult.acknowledged || !witnessResult.insertedId) {
      throw new Error('Error inserting BoundWitness')
    }
    // Store payloads
    const result = await this.payloads.insertMany(payloads)
    if (result.insertedCount != payloads.length) {
      throw new Error('Error inserting Payloads')
    }
    return payloads
  }
}
