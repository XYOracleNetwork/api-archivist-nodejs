import 'reflect-metadata'

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
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken } from 'mongodb'

import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> {
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
    this.registerWithChangeStream()
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
    console.log('processing change from change stream')
    this.resumeAfter = change._id
    const payload: XyoPayloadWithMeta = change.fullDocument
    console.log(payload.schema)
    // TODO: Increment counts in DB
    console.log('processed change from change stream')
  }

  private registerWithChangeStream = () => {
    console.log('registering with change stream')
    void this.sdk?.useCollection((collection) => {
      const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
      const changeStream = collection.watch([], opts)
      changeStream.on('change', this.processChange)
      changeStream.on('error', () => {
        console.log('re-registering with change stream')
        this.registerWithChangeStream
        console.log('re-registered with change stream')
      })
      console.log('registered with change stream')
    })
  }
}
