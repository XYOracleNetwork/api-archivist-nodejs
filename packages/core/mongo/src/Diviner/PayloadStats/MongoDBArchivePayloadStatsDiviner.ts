import 'reflect-metadata'

import { PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import {
  XyoAbstractDiviner,
  XyoAccount,
  XyoArchivistPayloadDivinerConfigSchema,
  XyoDivinerConfig,
  XyoDivinerDivineQuerySchema,
  XyoPayload,
  XyoPayloadBuilder,
  XyoPayloads,
} from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'

type StatsSchema = 'network.xyo.archivist.payload.stats'
const StatsSchema: StatsSchema = 'network.xyo.archivist.payload.stats'

export type ArchiveStatsPayload = XyoPayload<{ schema: StatsSchema }> & { count: number }
export type ArchiveConfigPayload = XyoDivinerConfig<XyoPayload & { archive?: string }>

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoAbstractDiviner<ArchiveConfigPayload> {
  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
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
