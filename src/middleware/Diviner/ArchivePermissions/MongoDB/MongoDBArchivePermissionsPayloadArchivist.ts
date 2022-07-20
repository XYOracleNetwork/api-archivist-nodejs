import 'reflect-metadata'

import { XyoAccount, XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import { AbstractMongoDBPayloadArchivist, getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk, removeId } from '../../../../lib'
import { SetArchivePermissionsPayload, SetArchivePermissionsPayloadWithMeta, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '../../../../model'
import { TYPES } from '../../../../types'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

@injectable()
export class MongoDBArchivePermissionsPayloadPayloadArchivist extends AbstractMongoDBPayloadArchivist<SetArchivePermissionsPayload> {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.PayloadSdkMongo) protected readonly items: BaseMongoSdk<SetArchivePermissionsPayloadWithMeta>
  ) {
    super()
  }
  async find(filter: Filter<SetArchivePermissionsPayloadWithMeta>) {
    return (await this.items.find(filter)).limit(100).toArray()
  }
  async get(archive: string): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    return (await getArchivistPayloadMongoSdk(archive).find({ _archive: archive, schema }))
      .sort({ _timestamp: -1 })
      .limit(1)
      .toArray() as unknown as SetArchivePermissionsPayloadWithMeta[]
  }
  async insert(items: SetArchivePermissionsPayloadWithMeta[]): Promise<SetArchivePermissionsPayloadWithMeta[]> {
    for (let i = 0; i < items.length; i++) {
      const item = removeId(items[i]) as SetArchivePermissionsPayloadWithMeta
      const _timestamp = Date.now()
      const archive = item._archive
      if (archive) {
        const payload = new XyoPayloadBuilder({ schema }).fields({ ...item, _timestamp }).build()
        const payloadResult = await getArchivistPayloadMongoSdk(archive).insert(payload)
        if (!payloadResult.acknowledged || !payloadResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting Payload')
        const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(payload).build()
        const bwResult = await getArchivistBoundWitnessesMongoSdk(archive).insert(bw)
        if (!bwResult.acknowledged || !bwResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting BoundWitness')
      }
    }
    return items
  }
}
