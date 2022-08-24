import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import {
  SetArchivePermissionsPayload,
  SetArchivePermissionsPayloadWithMeta,
  SetArchivePermissionsSchema,
  setArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayloadFindFilter, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { AbstractMongoDBPayloadArchivist } from '../../AbstractArchivist'
import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

@injectable()
export class MongoDBArchivePermissionsPayloadPayloadArchivist extends AbstractMongoDBPayloadArchivist<SetArchivePermissionsPayload> {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<SetArchivePermissionsPayloadWithMeta>,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitness>,
  ) {
    super()
  }
  find(_filter: XyoPayloadFindFilter): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    throw new Error('Not Implemented')
  }
  async get(_archive: string): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    const payloads = await (await this.payloads.find({ _archive, schema })).sort({ _timestamp: -1 }).limit(1).toArray()
    const permissions = payloads.map(removeId).pop()
    if (!permissions) return []
    const payload_hashes = new XyoPayloadWrapper(permissions).hash
    const witness = await this.boundWitnesses.findOne({ _archive, payload_hashes })
    return witness ? [permissions] : []
  }
  async insert(items: SetArchivePermissionsPayloadWithMeta[]): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    const _timestamp = Date.now()
    const payloads: SetArchivePermissionsPayloadWithMeta[] = items.map((p) => {
      return { ...removeId(p), _archive: assertEx(p._archive, 'No archive supplied for SetArchivePermissionsPayloadWithMeta'), _timestamp }
    })
    const boundWitnesses: XyoBoundWitness[] = payloads.map((p) => {
      const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(p).build()
      const _archive = p._archive
      return { ...bw, _archive, _timestamp }
    })

    const payloadsResults = await this.payloads.insertMany(payloads)
    if (!payloadsResults.acknowledged || payloadsResults.insertedCount !== payloads.length)
      throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting Payloads')

    const witnessResults = await this.boundWitnesses.insertMany(boundWitnesses)
    if (!witnessResults.acknowledged || witnessResults.insertedCount !== boundWitnesses.length)
      throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting BoundWitnesses')

    return items
  }
}
