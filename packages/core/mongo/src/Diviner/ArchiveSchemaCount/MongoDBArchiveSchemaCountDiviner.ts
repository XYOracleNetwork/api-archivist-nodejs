import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { ArchiveArchivist, ArchiveSchemaCountDiviner, Job, JobProvider } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

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
export class MongoDBArchiveSchemaCountDiviner implements ArchiveSchemaCountDiviner, JobProvider {
  protected readonly batchLimit = 100
  protected nextOffset = 0
  protected pendingCounts: Record<string, Record<string, number>> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {
    void this.registerWithChangeStream()
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

  async find(archive: string): Promise<Record<string, number>> {
    return await this.divineArchive(archive)
  }

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
    const result: PayloadSchemaCountsAggregateResult[] = await this.sdk.useCollection((collection) => {
      return collection
        .aggregate()
        .match({ _archive: archive })
        .group<PayloadSchemaCountsAggregateResult>({ _id: '$schema', count: { $sum: 1 } })
        .sort({ count: -1 })
        .toArray()
    })
    const count = result.reduce<Record<string, number>>((o, schemaCount) => ({ ...o, [schemaCount._id]: schemaCount.count }), {})
    await this.storeDivinedResult(archive, count)
    return count
  }

  private divineArchivesBatch = async () => {
    const result = await this.archiveArchivist.find({ limit: this.batchLimit, offset: this.nextOffset })
    const archives = result.map((archive) => archive.archive)
    this.nextOffset = archives.length < this.batchLimit ? 0 : this.nextOffset + this.batchLimit
    await Promise.allSettled(archives.map(this.divineArchiveFull))
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
    const wrapper = MongoClientWrapper.get(this.sdk.uri, this.sdk.config.maxPoolSize)
    const connection = await wrapper.connect()
    assertEx(connection, 'Connection failed')
    const collection = connection.db(DATABASES.Archivist).collection(COLLECTIONS.Payloads)
    const opts: ChangeStreamOptions = this.resumeAfter ? { resumeAfter: this.resumeAfter } : {}
    const changeStream = collection.watch([], opts)
    changeStream.on('change', this.processChange)
    changeStream.on('error', this.registerWithChangeStream)
  }

  private storeDivinedResult = async (archive: string, count: Record<string, number>) => {
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { ['schema.count']: count } }, updateOptions)
    })
    this.pendingCounts[archive] = {}
  }

  private updateChanges = async () => {
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
    await Promise.allSettled(updates)
  }
}
