import 'reflect-metadata'

import {
  SetArchivePermissionsPayload,
  SetArchivePermissionsPayloadWithMeta,
  SetArchivePermissionsSchema,
  setArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayloadBuilder, XyoPayloadFindFilter } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { AbstractMongoDBPayloadArchivist } from '../../AbstractArchivist'
import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk, removeId } from '../../Mongo'
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
  async get(archive: string): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    return (await this.payloads.find({ _archive: archive, schema })).sort({ _timestamp: -1 }).limit(1).toArray()
  }
  async insert(items: SetArchivePermissionsPayloadWithMeta[]): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    const sanitized: SetArchivePermissionsPayloadWithMeta[] = items.map<SetArchivePermissionsPayloadWithMeta>(removeId)
    for (let i = 0; i < sanitized.length; i++) {
      const item = sanitized[i]
      const _timestamp = Date.now()
      const archive = item._archive
      if (archive) {
        const payload = new XyoPayloadBuilder<SetArchivePermissionsPayloadWithMeta>({ schema }).fields({ ...item, _timestamp }).build()
        const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(payload).build()
        bw._archive = archive
        const payloadResult = await this.payloads.insertOne(payload)
        if (!payloadResult.acknowledged || !payloadResult.insertedId)
          throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting Payload')
        const bwResult = await this.boundWitnesses.insertOne(bw)
        if (!bwResult.acknowledged || !bwResult.insertedId)
          throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting BoundWitness')
      }
    }
    return items
  }
}
