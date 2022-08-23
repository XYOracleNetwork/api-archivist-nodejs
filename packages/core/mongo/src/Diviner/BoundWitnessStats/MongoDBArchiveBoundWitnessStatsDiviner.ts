import 'reflect-metadata'

import { BoundWitnessStatsDiviner, BoundWitnessStatsPayload, BoundWitnessStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoAbstractDiviner, XyoAccount, XyoBoundWitnessWithMeta, XyoPayload, XyoPayloadBuilder, XyoPayloads } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../PayloadStats'

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoAbstractDiviner<ArchiveConfigPayload> implements BoundWitnessStatsDiviner {
  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
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
}
