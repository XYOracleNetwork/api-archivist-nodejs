import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { BoundWitnessStatsDiviner, BoundWitnessStatsPayload, BoundWitnessStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoBoundWitnessWithMeta, XyoPayload, XyoPayloadBuilder, XyoPayloads, XyoPayloadSchema } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DBS } from '../../dbs'
import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

const updateOptions: UpdateOptions = { upsert: true }

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> implements BoundWitnessStatsDiviner {
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
    void this.registerWithChangeStream()
  }

  get queries() {
    return [XyoDivinerDivineQuerySchema]
  }

  override async divine(payloads?: XyoPayloads | undefined): Promise<XyoPayload> {
    const archivePayload = payloads?.find((payload): payload is MongoArchivePayload => payload?.schema === MongoArchiveSchema)
    const archive = archivePayload?.archive ?? this.config.archive

    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsSchema }).fields({ count }).build()

    return result
  }

  private processChange = async (change: ChangeStreamInsertDocument<XyoBoundWitnessWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    if (archive) {
      const $inc = { [`${COLLECTIONS.BoundWitnesses}.count`]: 1 }
      await this.sdk.useMongo(async (mongo) => {
        await mongo.db(DBS.Archivist).collection(COLLECTIONS.Stats).updateOne({ archive }, { $inc }, updateOptions)
      })
    }
  }

  private registerWithChangeStream = async () => {
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DBS.Archivist).collection(COLLECTIONS.BoundWitnesses)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', this.registerWithChangeStream)
  }
}
