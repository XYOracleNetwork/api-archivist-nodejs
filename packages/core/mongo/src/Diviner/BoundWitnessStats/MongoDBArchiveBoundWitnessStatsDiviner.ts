import 'reflect-metadata'

import {
  BoundWitnessStatsDiviner,
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
  BoundWitnessStatsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema } from '@xyo-network/diviner'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { XyoAbstractDiviner, XyoAccount, XyoBoundWitnessWithMeta, XyoPayloadBuilder, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoAbstractDiviner<BoundWitnessStatsQueryPayload> implements BoundWitnessStatsDiviner {
  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
  }
  async query(query: XyoQueryPayload<BoundWitnessStatsQueryPayload>): Promise<XyoModuleQueryResult<BoundWitnessStatsPayload>> {
    const archive = query.archive
    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsSchema }).fields({ count }).build()
    const witnessedResult = this.bindPayloads([result])
    return [witnessedResult, [result]]
  }
}
