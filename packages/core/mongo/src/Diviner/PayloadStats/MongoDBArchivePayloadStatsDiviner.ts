import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import { PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import {
  XyoArchivistPayloadDivinerConfigSchema,
  XyoDiviner,
  XyoDivinerDivineQuerySchema,
  XyoPayload,
  XyoPayloadBuilder,
  XyoPayloads,
  XyoPayloadSchema,
} from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> {
  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
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
}
