import 'reflect-metadata'

import { PayloadStatsDiviner, PayloadStatsPayload, PayloadStatsQueryPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoModuleQueryResult } from '@xyo-network/module'
import {
  XyoAbstractDiviner,
  XyoAccount,
  XyoArchivistPayloadDivinerConfigSchema,
  XyoDiviner,
  XyoPayload,
  XyoPayloadBuilder,
  XyoQueryPayload,
} from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

type StatsSchema = 'network.xyo.archivist.payload.stats'
const StatsSchema: StatsSchema = 'network.xyo.archivist.payload.stats'

export type ArchiveStatsPayload = XyoPayload<{ schema: StatsSchema }> & { count: number }
export type ArchiveQueryPayload = XyoQueryPayload<XyoPayload & { archive?: string }>

export type StatsDiviner = XyoDiviner<ArchiveQueryPayload>

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoAbstractDiviner<PayloadStatsQueryPayload> implements PayloadStatsDiviner {
  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
  }
  async query(query: XyoQueryPayload<PayloadStatsQueryPayload>): Promise<XyoModuleQueryResult<PayloadStatsPayload>> {
    const archive = query.archive
    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<PayloadStatsPayload>({ schema: PayloadStatsSchema }).fields({ count }).build()
    const witnessedResult = this.bindPayloads([result])
    return [witnessedResult, [result]]
  }
}
