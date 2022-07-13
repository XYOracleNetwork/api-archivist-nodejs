import 'reflect-metadata'

import { XyoAccount, XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import {
  AbstractMongoDBPayloadRepository,
  AbstractMongoDBPayloadRepositoryOpts,
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadMongoSdk,
  getBaseMongoSdk,
  getDefaultAbstractMongoDBPayloadRepositoryOpts,
  removeId,
} from '../../../../lib'
import { SetArchivePermissionsPayload, SetArchivePermissionsPayloadWithMeta, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '../../../../model'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

@injectable()
export class MongoDBArchivePermissionsPayloadPayloadRepository extends AbstractMongoDBPayloadRepository<SetArchivePermissionsPayload> {
  protected readonly items: BaseMongoSdk<SetArchivePermissionsPayloadWithMeta> = getBaseMongoSdk('payload')
  protected opts: AbstractMongoDBPayloadRepositoryOpts = getDefaultAbstractMongoDBPayloadRepositoryOpts()
  constructor(@inject(XyoAccount) account: XyoAccount) {
    super(getDefaultAbstractMongoDBPayloadRepositoryOpts())
  }
  async find(filter: Filter<SetArchivePermissionsPayloadWithMeta>) {
    return (await this.items.find(filter)).toArray()
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
        if (!payloadResult.acknowledged || !payloadResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting Payload')
        const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(payload).build()
        const bwResult = await getArchivistBoundWitnessesMongoSdk(archive).insert(bw)
        if (!bwResult.acknowledged || !bwResult.insertedId) throw new Error('MongoDBArchivePermissionsPayloadPayloadRepository: Error inserting BoundWitness')
      }
    }
    return items
  }
}
