import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { BoundWitnessStatsDiviner, BoundWitnessStatsPayload, BoundWitnessStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloadBuilder, XyoPayloads, XyoPayloadSchema } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { Task } from '../../Job'
import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

const updateOptions: UpdateOptions = { upsert: true }

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> implements BoundWitnessStatsDiviner {
  protected pendingCounts: Record<string, number> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
    void this.registerWithChangeStream()
  }

  get queries() {
    return [XyoDivinerDivineQuerySchema]
  }

  get task(): Task {
    return async () => await this.updateChanges()
  }

  override async divine(payloads?: XyoPayloads): Promise<XyoPayload> {
    const archivePayload = payloads?.find((payload): payload is MongoArchivePayload => payload?.schema === MongoArchiveSchema)
    const archive = archivePayload?.archive ?? this.config.archive
    const count = archive ? await this.divineArchive(archive) : await this.divineArchives()
    return new XyoPayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsSchema }).fields({ count }).build()
  }

  private divineArchive = async (archive: string) => {
    const count = await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { [`${COLLECTIONS.BoundWitnesses}.count`]: count } }, updateOptions)
    })
    return count
  }

  private divineArchives = () => this.sdk.useCollection((collection) => collection.estimatedDocumentCount())

  private processChange = (change: ChangeStreamInsertDocument<XyoBoundWitnessWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    if (archive) this.pendingCounts[archive] = (this.pendingCounts[archive] || 0) + 1
    // await this.updateChanges()
  }

  private registerWithChangeStream = async () => {
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.BoundWitnesses)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', this.registerWithChangeStream)
  }

  private updateChanges = async () => {
    for (const archive in this.pendingCounts) {
      if (Object.prototype.hasOwnProperty.call(this.pendingCounts, archive)) {
        const count = this.pendingCounts[archive]
        const $inc = { [`${COLLECTIONS.BoundWitnesses}.count`]: count }
        try {
          await this.sdk.useMongo(async (mongo) => {
            await mongo.db(DATABASES.Archivist).collection(COLLECTIONS.ArchivistStats).updateOne({ archive }, { $inc }, updateOptions)
          })
          this.pendingCounts[archive] = 0
        } catch (_error) {
          /* TODO: Log */
        }
      }
    }
  }
}
