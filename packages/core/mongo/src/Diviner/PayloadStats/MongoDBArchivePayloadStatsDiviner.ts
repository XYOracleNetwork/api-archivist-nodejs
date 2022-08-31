import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoDiviner, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import {
  XyoArchivistPayloadDivinerConfigSchema,
  XyoPayload,
  XyoPayloadBuilder,
  XyoPayloads,
  XyoPayloadSchema,
  XyoPayloadWithMeta,
} from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DBS } from '../../dbs'
import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> {
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
    void this.registerWithChangeStream()
  }

  get queries() {
    return [XyoDivinerDivineQuerySchema]
  }

  public async divine(payloads: XyoPayloads): Promise<XyoPayload | null> {
    const archivePayload = payloads?.find((payload): payload is MongoArchivePayload => payload?.schema === MongoArchiveSchema)
    const archive = archivePayload?.archive ?? this.config.archive

    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<PayloadStatsPayload>({ schema: PayloadStatsSchema }).fields({ count }).build()
    return result
  }

  private processChange = async (change: ChangeStreamInsertDocument<XyoPayloadWithMeta>) => {
    this.resumeAfter = change._id
    const payload: XyoPayloadWithMeta = change.fullDocument
    const archive = payload._archive
    if (archive) {
      await this.sdk.useMongo(async (mongo) => {
        await mongo
          .db(DBS.Archivist)
          .collection(COLLECTIONS.Stats)
          .updateOne({ archive }, { $inc: { 'payloads.count': 1 } }, { upsert: true })
      })
    }
  }

  private registerWithChangeStream = async () => {
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DBS.Archivist).collection(COLLECTIONS.Payloads)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', this.registerWithChangeStream)
  }
}
