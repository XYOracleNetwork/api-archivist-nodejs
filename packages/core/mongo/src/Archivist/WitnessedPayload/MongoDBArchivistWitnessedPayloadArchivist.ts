import 'reflect-metadata'

import { exists } from '@xylabs/sdk-js'
import { AbstractPayloadArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoAccount, XyoBoundWitnessBuilder, XyoBoundWitnessWithMeta, XyoPayloadFindFilter, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

const unique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index
}

@injectable()
class MongoDBArchivistWitnessedPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta, string> {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<XyoPayloadWithMeta>,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super()
  }
  find(_filter: XyoPayloadFindFilter): Promise<XyoPayloadWithMeta[]> {
    throw new Error('Not implemented')
  }
  async get(hash: string): Promise<XyoPayloadWithMeta[]> {
    // Find bw signed by us that has this hash
    const bound_witnesses = await (await this.boundWitnesses.find({ payload_hashes: hash })).limit(100).toArray()
    const archives = bound_witnesses
      .map((bw) => bw._archive)
      .filter(exists)
      .filter(unique)
    return (await this.payloads.find({ _archive: { $in: archives }, _hash: hash })).limit(100).toArray()
  }
  async insert(payloads: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    // Witness from archivist
    const _timestamp = Date.now()
    const bw = new XyoBoundWitnessBuilder({ inlinePayloads: false }).payloads(payloads).build()
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
    return payloads
  }
}

export { MongoDBArchivistWitnessedPayloadArchivist }
