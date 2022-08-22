import 'reflect-metadata'

import { BoundWitnessStatsDiviner, BoundWitnessStatsPayload, BoundWitnessStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDivinerQueryPayload, XyoDivinerQueryPayloadSchema } from '@xyo-network/diviner'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { XyoAbstractDiviner, XyoAccount, XyoBoundWitnessWithMeta, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'
import { ArchiveConfigPayload } from '../PayloadStats'

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoAbstractDiviner<ArchiveConfigPayload> implements BoundWitnessStatsDiviner {
  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
  }

  get queries(): string[] {
    return [XyoDivinerQueryPayloadSchema]
  }

  async query(query: XyoDivinerQueryPayload): Promise<XyoModuleQueryResult<BoundWitnessStatsPayload>> {
    //TODO [AT]: Make a archive descriptor payload to send in here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const overrideArchivePayload: any = query.payloads?.find((payload) => payload.schema === 'network.xyo.diviner.archive')
    const archive = overrideArchivePayload?.archive ?? this.config.archive
    const count = archive
      ? await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
      : await this.sdk.useCollection((collection) => collection.estimatedDocumentCount())
    const result = new XyoPayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsSchema }).fields({ count }).build()
    const witnessedResult = this.bindPayloads([result])
    return [witnessedResult, [result]]
  }
}
