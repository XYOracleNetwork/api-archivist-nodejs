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

import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> {
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(TYPES.Logger) protected logger: Console, // TODO: Use interface from SDK JS
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {
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

  private processChange = (change: ChangeStreamInsertDocument<XyoPayloadWithMeta>) => {
    this.logger.log('processing change from change stream')
    this.resumeAfter = change._id
    const payload: XyoPayloadWithMeta = change.fullDocument
    this.logger.log(payload.schema)
    // TODO: Increment counts in DB
    this.logger.log('processed change from change stream')
  }

  private registerWithChangeStream = async () => {
    this.logger.log('registering with change stream')
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db('archivist').collection('payloads')
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', (e) => {
      this.logger.log(e)
      this.logger.log('re-registering with change stream')
      this.registerWithChangeStream
      this.logger.log('re-registered with change stream')
    })
    this.logger.log('registered with change stream')
  }
}
