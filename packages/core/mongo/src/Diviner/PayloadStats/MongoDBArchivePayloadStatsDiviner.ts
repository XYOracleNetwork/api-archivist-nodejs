import 'reflect-metadata'

import { PayloadStatsDiviner, PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoModuleQueryResult } from '@xyo-network/module'
import {
  XyoAbstractDiviner,
  XyoAccount,
  XyoArchivistPayloadDivinerConfigSchema,
  XyoDiviner,
  XyoDivinerConfig,
  XyoDivinerQueryPayload,
  XyoDivinerQueryPayloadSchema,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

type StatsSchema = 'network.xyo.archivist.payload.stats'
const StatsSchema: StatsSchema = 'network.xyo.archivist.payload.stats'

export type ArchiveStatsPayload = XyoPayload<{ schema: StatsSchema }> & { count: number }
export type ArchiveConfigPayload = XyoDivinerConfig<XyoPayload & { archive?: string }>

export type StatsDiviner = XyoDiviner<ArchiveConfigPayload>

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoAbstractDiviner<ArchiveConfigPayload> implements PayloadStatsDiviner {
  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
  }

  get queries(): string[] {
    return [XyoDivinerQueryPayloadSchema]
  }

  async query(query: XyoDivinerQueryPayload): Promise<XyoModuleQueryResult<PayloadStatsPayload>> {
    //TODO [AT]: Make a archive descriptor payload to send in here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const overrideArchivePayload: any = query.payloads?.find((payload) => payload.schema === 'network.xyo.diviner.archive')
    const archive = overrideArchivePayload?.archive ?? this.config.archive
    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<PayloadStatsPayload>({ schema: PayloadStatsSchema }).fields({ count }).build()
    const witnessedResult = this.bindPayloads([result])
    return [witnessedResult, [result]]
  }
}
