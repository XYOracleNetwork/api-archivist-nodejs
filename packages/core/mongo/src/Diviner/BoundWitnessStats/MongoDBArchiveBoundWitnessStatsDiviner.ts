import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveArchivist,
  BoundWitnessStatsDiviner,
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
  BoundWitnessStatsSchema,
  isBoundWitnessStatsQueryPayload,
  XyoBoundWitnessWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'
import { ChangeStream, ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'

const updateOptions: UpdateOptions = { upsert: true }

interface Stats {
  archive: string
  bound_witnesses?: {
    count?: number
  }
}

@injectable()
export class MongoDBArchiveBoundWitnessStatsDiviner extends XyoDiviner implements BoundWitnessStatsDiviner, JobProvider {
  protected readonly batchLimit = 100
  protected changeStream: ChangeStream | undefined = undefined
  protected nextOffset = 0
  protected pendingCounts: Record<string, number> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBArchiveBoundWitnessStatsDiviner.UpdateChanges',
        onSuccess: () => {
          this.pendingCounts = {}
        },
        schedule: '1 minute',
        task: async () => await this.updateChanges(),
      },
      {
        name: 'MongoDBArchiveBoundWitnessStatsDiviner.DivineArchivesBatch',
        schedule: '10 minute',
        task: async () => await this.divineArchivesBatch(),
      },
    ]
  }

  override async divine(payloads?: XyoPayloads): Promise<XyoPayloads<BoundWitnessStatsPayload>> {
    const query = payloads?.find<BoundWitnessStatsQueryPayload>(isBoundWitnessStatsQueryPayload)
    const archive = query?.archive
    const count = archive ? await this.divineArchive(archive) : await this.divineAllArchives()
    return [new XyoPayloadBuilder<BoundWitnessStatsPayload>({ schema: BoundWitnessStatsSchema }).fields({ count }).build()]
  }

  override async initialize(): Promise<void> {
    await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    await this.changeStream?.close()
  }

  private divineAllArchives = () => this.sdk.useCollection((collection) => collection.estimatedDocumentCount())

  private divineArchive = async (archive: string) => {
    const stats = await this.sdk.useMongo(async (mongo) => {
      return await mongo.db(DATABASES.Archivist).collection<Stats>(COLLECTIONS.ArchivistStats).findOne({ archive })
    })
    const remote = stats?.bound_witnesses?.count || 0
    const local = this.pendingCounts[archive] || 0
    return remote + local
  }

  private divineArchiveFull = async (archive: string) => {
    const count = await this.sdk.useCollection((collection) => collection.countDocuments({ _archive: archive }))
    await this.storeDivinedResult(archive, count)
    return count
  }

  private divineArchivesBatch = async () => {
    this.logger.log(`MongoDBArchiveBoundWitnessStatsDiviner.DivineArchivesBatch: Divining - Limit: ${this.batchLimit} Offset: ${this.nextOffset}`)
    const result = await this.archiveArchivist.find({ limit: this.batchLimit, offset: this.nextOffset })
    const archives = result.map((archive) => archive?.archive).filter(exists)
    this.logger.log(`MongoDBArchiveBoundWitnessStatsDiviner.DivineArchivesBatch: Divining ${archives.length} Archives`)
    this.nextOffset = archives.length < this.batchLimit ? 0 : this.nextOffset + this.batchLimit
    const results = await Promise.allSettled(archives.map(this.divineArchiveFull))
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchiveBoundWitnessStatsDiviner.DivineArchivesBatch: Divined - Succeeded: ${succeeded} Failed: ${failed}`)
  }

  private processChange = (change: ChangeStreamInsertDocument<XyoBoundWitnessWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    if (archive) this.pendingCounts[archive] = (this.pendingCounts[archive] || 0) + 1
  }

  private registerWithChangeStream = async () => {
    this.logger.log('MongoDBArchiveBoundWitnessStatsDiviner.RegisterWithChangeStream: Registering')
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.BoundWitnesses)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    this.changeStream = collection.watch([], opts)
    this.changeStream.on('change', this.processChange)
    this.changeStream.on('error', this.registerWithChangeStream)
    this.logger.log('MongoDBArchiveBoundWitnessStatsDiviner.RegisterWithChangeStream: Registered')
  }

  private storeDivinedResult = async (archive: string, count: number) => {
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { [`${COLLECTIONS.BoundWitnesses}.count`]: count } }, updateOptions)
    })
    this.pendingCounts[archive] = 0
  }

  private updateChanges = async () => {
    this.logger.log('MongoDBArchiveBoundWitnessStatsDiviner.UpdateChanges: Updating')
    const updates = Object.keys(this.pendingCounts).map((archive) => {
      const count = this.pendingCounts[archive]
      this.pendingCounts[archive] = 0
      const $inc = { [`${COLLECTIONS.BoundWitnesses}.count`]: count }
      return this.sdk.useMongo(async (mongo) => {
        await mongo.db(DATABASES.Archivist).collection(COLLECTIONS.ArchivistStats).updateOne({ archive }, { $inc }, updateOptions)
      })
    })
    const results = await Promise.allSettled(updates)
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchiveBoundWitnessStatsDiviner.UpdateChanges: Updated - Succeeded: ${succeeded} Failed: ${failed}`)
  }
}
