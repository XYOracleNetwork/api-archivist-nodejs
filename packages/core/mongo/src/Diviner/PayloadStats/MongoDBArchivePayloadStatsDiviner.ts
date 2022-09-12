import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveArchivist,
  isPayloadStatsQueryPayload,
  Job,
  JobProvider,
  Logger,
  PayloadStatsDiviner,
  PayloadStatsPayload,
  PayloadStatsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloadBuilder, XyoPayloads, XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'
import { ArchiveConfigPayload } from '../Payloads'

const updateOptions: UpdateOptions = { upsert: true }

interface Stats {
  archive: string
  payloads?: {
    count?: number
  }
}

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> implements PayloadStatsDiviner, JobProvider {
  protected readonly batchLimit = 100
  protected nextOffset = 0
  protected pendingCounts: Record<string, number> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema })
    void this.registerWithChangeStream()
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBArchivePayloadStatsDiviner.UpdateChanges',
        onSuccess: () => {
          this.pendingCounts = {}
        },
        schedule: '1 minute',
        task: async () => await this.updateChanges(),
      },
      {
        name: 'MongoDBArchivePayloadStatsDiviner.DivineArchivesBatch',
        schedule: '10 minute',
        task: async () => await this.divineArchivesBatch(),
      },
    ]
  }

  get queries() {
    return [XyoDivinerDivineQuerySchema]
  }

  public async divine(payloads?: XyoPayloads): Promise<PayloadStatsPayload> {
    const query = payloads?.find(isPayloadStatsQueryPayload)
    const archive = query?.archive ?? this.config.archive
    const count = archive ? await this.divineArchive(archive) : await this.divineAllArchives()
    return new XyoPayloadBuilder<PayloadStatsPayload>({ schema: PayloadStatsSchema }).fields({ count }).build()
  }

  private divineAllArchives = () => this.sdk.useCollection((collection) => collection.estimatedDocumentCount())

  private divineArchive = async (archive: string) => {
    const stats = await this.sdk.useMongo(async (mongo) => {
      return await mongo.db(DATABASES.Archivist).collection<Stats>(COLLECTIONS.ArchivistStats).findOne({ archive })
    })
    const remote = stats?.payloads?.count || 0
    const local = this.pendingCounts[archive] || 0
    return remote + local
  }

  private divineArchiveFull = async (archive: string) => {
    const count = await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
    await this.storeDivinedResult(archive, count)
    return count
  }

  private divineArchivesBatch = async () => {
    this.logger.log(`MongoDBArchivePayloadStatsDiviner.DivineArchivesBatch: Divining - Limit: ${this.batchLimit} Offset: ${this.nextOffset}`)
    const result = await this.archiveArchivist.find({ limit: this.batchLimit, offset: this.nextOffset })
    const archives = result.map((archive) => archive.archive)
    this.logger.log(`MongoDBArchivePayloadStatsDiviner.DivineArchivesBatch: Divining ${archives.length} Archives`)
    this.nextOffset = archives.length < this.batchLimit ? 0 : this.nextOffset + this.batchLimit
    const results = await Promise.allSettled(archives.map(this.divineArchiveFull))
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchivePayloadStatsDiviner.DivineArchivesBatch: Divined - Succeeded: ${succeeded} Failed: ${failed}`)
  }

  private processChange = (change: ChangeStreamInsertDocument<XyoPayloadWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    if (archive) this.pendingCounts[archive] = (this.pendingCounts[archive] || 0) + 1
  }

  private registerWithChangeStream = async () => {
    this.logger.log('MongoDBArchivePayloadStatsDiviner.RegisterWithChangeStream: Registering')
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.Payloads)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', this.registerWithChangeStream)
    this.logger.log('MongoDBArchivePayloadStatsDiviner.RegisterWithChangeStream: Registered')
  }

  private storeDivinedResult = async (archive: string, count: number) => {
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { [`${COLLECTIONS.Payloads}.count`]: count } }, updateOptions)
    })
    this.pendingCounts[archive] = 0
  }

  private updateChanges = async () => {
    this.logger.log('MongoDBArchivePayloadStatsDiviner.UpdateChanges: Updating')
    const updates = Object.keys(this.pendingCounts).map((archive) => {
      const count = this.pendingCounts[archive]
      this.pendingCounts[archive] = 0
      const $inc = { [`${COLLECTIONS.Payloads}.count`]: count }
      return this.sdk.useMongo(async (mongo) => {
        await mongo.db(DATABASES.Archivist).collection(COLLECTIONS.ArchivistStats).updateOne({ archive }, { $inc }, updateOptions)
      })
    })
    const results = await Promise.allSettled(updates)
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchivePayloadStatsDiviner.UpdateChanges: Updated - Succeeded: ${succeeded} Failed: ${failed}`)
  }
}
