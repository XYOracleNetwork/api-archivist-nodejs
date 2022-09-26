import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import {
  ArchiveArchivist,
  isSchemaStatsQueryPayload,
  Job,
  JobProvider,
  Logger,
  SchemaStatsDiviner,
  SchemaStatsPayload,
  SchemaStatsQueryPayload,
  SchemaStatsSchema,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStream, ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'
import { fromDbProperty, toDbProperty } from '../../Util'

const updateOptions: UpdateOptions = { upsert: true }

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}

interface Stats {
  archive: string
  schema?: {
    count?: Record<string, number>
  }
}

@injectable()
export class MongoDBArchiveSchemaStatsDiviner extends XyoDiviner implements SchemaStatsDiviner, JobProvider {
  /**
   * The max number of records to search for the aggregate query
   */
  protected readonly aggregateLimit = 10000
  /**
   * The max number of iterations of aggregate queries to allow when
   * divining the schema stats within an archive
   */
  protected readonly aggregateMaxIterations = 10000
  /**
   * The amount of time to allow the aggregate query to execute
   */
  protected readonly aggregateTimeout = 2000
  /**
   * The max number of simultaneous archives to divine at once
   */
  protected readonly batchLimit = 100
  /**
   * The stream with which the diviner is notified of insertions
   * to the payloads collection
   */
  protected changeStream: ChangeStream | undefined = undefined
  /**
   * The next offset from which to begin batch divining archives
   */
  protected nextOffset = 0
  /**
   * The counts per schema to update on the next update interval
   */
  protected pendingCounts: Record<string, Record<string, number>> = {}
  /**
   * The resume token for listening to insertions into the payload collection
   */
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBArchiveSchemaCountDiviner.UpdateChanges',
        onSuccess: () => {
          this.pendingCounts = {}
        },
        schedule: '1 minute',
        task: async () => await this.updateChanges(),
      },
      {
        name: 'MongoDBArchiveSchemaCountDiviner.DivineArchivesBatch',
        schedule: '10 minute',
        task: async () => await this.divineArchivesBatch(),
      },
    ]
  }

  override async divine(context?: string, payloads?: XyoPayloads): Promise<XyoPayloads<SchemaStatsPayload>> {
    const query = payloads?.find<SchemaStatsQueryPayload>(isSchemaStatsQueryPayload)
    const archive = query?.archive
    const count = archive ? await this.divineArchive(archive) : await this.divineAllArchives()
    return [new XyoPayloadBuilder<SchemaStatsPayload>({ schema: SchemaStatsSchema }).fields({ count }).build()]
  }

  override async initialize(): Promise<void> {
    await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    await this.changeStream?.close()
  }

  private divineAllArchives = async () => await Promise.reject('Not implemented')

  private divineArchive = async (archive: string): Promise<Record<string, number>> => {
    const stats = await this.sdk.useMongo(async (mongo) => {
      return await mongo.db(DATABASES.Archivist).collection<Stats>(COLLECTIONS.ArchivistStats).findOne({ archive })
    })
    const remote = Object.fromEntries(
      Object.entries(stats?.schema?.count || {}).map(([schema, count]) => {
        return [fromDbProperty(schema), count]
      }),
    )
    const local = this.pendingCounts[archive] || {}
    const keys = [...Object.keys(local), ...Object.keys(remote).map(fromDbProperty)]
    const ret = Object.fromEntries(
      keys.map((key) => {
        const localSchemaCount = local[key] || 0
        const remoteSchemaCount = remote[key] || 0
        const value = localSchemaCount + remoteSchemaCount
        return [key, value]
      }),
    )
    return ret
  }

  private divineArchiveFull = async (archive: string): Promise<Record<string, number>> => {
    const sortStartTime = Date.now()
    const totals: Record<string, number> = {}
    for (let iteration = 0; iteration < this.aggregateMaxIterations; iteration++) {
      const result: PayloadSchemaCountsAggregateResult[] = await this.sdk.useCollection((collection) => {
        return collection
          .aggregate()
          .sort({ _archive: 1, _timestamp: 1 })
          .match({ _archive: archive, _timestamp: { $lt: sortStartTime } })
          .skip(iteration)
          .limit(this.aggregateLimit)
          .group<PayloadSchemaCountsAggregateResult>({ _id: '$schema', count: { $sum: 1 } })
          .maxTimeMS(this.aggregateTimeout)
          .toArray()
      })
      if (result.length < 1) break
      const count = result.reduce<Record<string, number>>((o, schemaCount) => ({ ...o, [schemaCount._id]: schemaCount.count }), {})
      // Add current counts to total
      Object.entries(count).map(([schema, count]) => {
        totals[schema] = totals[schema] || 0 + count
      })
    }
    await this.storeDivinedResult(archive, totals)
    return totals
  }

  private divineArchivesBatch = async () => {
    this.logger.log(`MongoDBArchiveSchemaCountDiviner.DivineArchivesBatch: Divining - Limit: ${this.batchLimit} Offset: ${this.nextOffset}`)
    const result = await this.archiveArchivist.find({ limit: this.batchLimit, offset: this.nextOffset })
    const archives = result.map((archive) => archive?.archive).filter(exists)
    this.logger.log(`MongoDBArchiveSchemaCountDiviner.DivineArchivesBatch: Divining ${archives.length} Archives`)
    this.nextOffset = archives.length < this.batchLimit ? 0 : this.nextOffset + this.batchLimit
    const results = await Promise.allSettled(archives.map(this.divineArchiveFull))
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchiveSchemaCountDiviner.DivineArchivesBatch: Divined - Succeeded: ${succeeded} Failed: ${failed}`)
  }

  private processChange = (change: ChangeStreamInsertDocument<XyoPayloadWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    const schema = change.fullDocument.schema
    if (archive && schema) {
      if (!this.pendingCounts[archive]) this.pendingCounts[archive] = {}
      this.pendingCounts[archive][schema] = (this.pendingCounts[archive][schema] || 0) + 1
    }
  }

  private registerWithChangeStream = async () => {
    this.logger.log('MongoDBArchiveSchemaCountDiviner.RegisterWithChangeStream: Registering')
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.Payloads)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    this.changeStream = collection.watch([], opts)
    this.changeStream.on('change', this.processChange)
    this.changeStream.on('error', this.registerWithChangeStream)
    this.logger.log('MongoDBArchiveSchemaCountDiviner.RegisterWithChangeStream: Registered')
  }

  private storeDivinedResult = async (archive: string, counts: Record<string, number>) => {
    const sanitizedCounts: Record<string, number> = Object.fromEntries(
      Object.entries(counts).map(([schema, count]) => {
        return [toDbProperty(schema), count]
      }),
    )
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { ['schema.count']: sanitizedCounts } }, updateOptions)
    })
    this.pendingCounts[archive] = {}
  }

  private updateChanges = async () => {
    this.logger.log('MongoDBArchiveSchemaCountDiviner.UpdateChanges: Updating')
    const updates = Object.keys(this.pendingCounts).map((archive) => {
      const $inc = Object.keys(this.pendingCounts[archive])
        .map((schema) => {
          return { [`schema.count.${toDbProperty(schema)}`]: this.pendingCounts[archive][schema] }
        })
        .reduce((prev, curr) => Object.assign(prev, curr), {})
      this.pendingCounts[archive] = {}
      return this.sdk.useMongo(async (mongo) => {
        await mongo.db(DATABASES.Archivist).collection(COLLECTIONS.ArchivistStats).updateOne({ archive }, { $inc }, updateOptions)
      })
    })
    const results = await Promise.allSettled(updates)
    const succeeded = results.filter((result) => result.status === 'fulfilled').length
    const failed = results.filter((result) => result.status === 'rejected').length
    this.logger.log(`MongoDBArchiveSchemaCountDiviner.UpdateChanges: Updated - Succeeded: ${succeeded} Failed: ${failed}`)
  }
}
