import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { ArchiveArchivist, ArchiveSchemaListDiviner, Job, JobProvider } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { KeyObject } from 'crypto'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'
import { fromDbProperty, toDbProperty } from '../../Util'

const updateOptions: UpdateOptions = { upsert: true }

interface Stats {
  archive: string
  schema?: {
    count?: Record<string, number>
  }
}

// TODO: Make into Diviner via plugin interface
@injectable()
export class MongoDBArchiveSchemaListDiviner implements ArchiveSchemaListDiviner, JobProvider {
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
        name: 'MongoDBArchiveSchemaListDiviner.UpdateChanges',
        onSuccess: () => {
          this.pendingCounts = {}
        },
        schedule: '1 minute',
        task: async () => await this.updateChanges(),
      },
      {
        name: 'MongoDBArchiveSchemaListDiviner.DivineArchivesBatch',
        schedule: '10 minute',
        task: async () => await Promise.resolve(),
      },
    ]
  }

  async find(archive: string): Promise<string[]> {
    return await this.sdk.useCollection((collection) => {
      return collection.distinct('schema', { _archive: archive })
    })
  }

  private divineArchive = async (archive: string) => {
    const stats = await this.sdk.useMongo(async (mongo) => {
      return await mongo.db(DATABASES.Archivist).collection<Stats>(COLLECTIONS.ArchivistStats).findOne({ archive })
    })
    const remote = stats?.schema?.count || {}
    const local = this.pendingCounts[archive] || {}
    const keys = [...Object.keys(local), ...Object.keys(remote).map(fromDbProperty)]
    Object.fromEntries(
      keys.map((key) => {
        const value = local[key] || 0 + remote[key] || 0
        return [key, value]
      }),
    )
    return [remote, local]
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
