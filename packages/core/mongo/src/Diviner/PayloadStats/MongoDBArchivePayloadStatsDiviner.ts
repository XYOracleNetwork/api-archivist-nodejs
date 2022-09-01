import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { Job, PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner, XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloadBuilder, XyoPayloads, XyoPayloadSchema, XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk, MongoClientWrapper } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { ChangeStreamInsertDocument, ChangeStreamOptions, ResumeToken, UpdateOptions } from 'mongodb'

import { COLLECTIONS } from '../../collections'
import { DATABASES } from '../../databases'
import { MONGO_TYPES } from '../../types'
import { MongoArchivePayload, MongoArchiveSchema } from '../MongoArchivePayload'
import { ArchiveConfigPayload } from '../Payloads'

const updateOptions: UpdateOptions = { upsert: true }

interface Stats {
  archive: string
  payloads?: {
    count?: number
  }
}

@injectable()
export class MongoDBArchivePayloadStatsDiviner extends XyoDiviner<XyoPayload, ArchiveConfigPayload> {
  protected pendingCounts: Record<string, number> = {}
  protected resumeAfter: ResumeToken | undefined = undefined

  constructor(@inject(TYPES.Account) account: XyoAccount, @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {
    super({ account, schema: XyoArchivistPayloadDivinerConfigSchema, targetSchema: XyoPayloadSchema })
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
    ]
  }

  get queries() {
    return [XyoDivinerDivineQuerySchema]
  }

  public async divine(payloads?: XyoPayloads): Promise<XyoPayload | null> {
    const archivePayload = payloads?.find((payload): payload is MongoArchivePayload => payload?.schema === MongoArchiveSchema)
    const archive = archivePayload?.archive ?? this.config.archive
    const count = archive ? await this.divineArchive(archive) : await this.divineArchives()
    return new XyoPayloadBuilder<PayloadStatsPayload>({ schema: PayloadStatsSchema }).fields({ count }).build()
  }

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
    await this.sdk.useMongo(async (mongo) => {
      await mongo
        .db(DATABASES.Archivist)
        .collection(COLLECTIONS.ArchivistStats)
        .updateOne({ archive }, { $set: { [`${COLLECTIONS.Payloads}.count`]: count } }, updateOptions)
    })
    return count
  }

  private divineArchives = () => this.sdk.useCollection((collection) => collection.estimatedDocumentCount())

  private processChange = (change: ChangeStreamInsertDocument<XyoPayloadWithMeta>) => {
    this.resumeAfter = change._id
    const archive = change.fullDocument._archive
    if (archive) this.pendingCounts[archive] = (this.pendingCounts[archive] || 0) + 1
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
    for (const archive in this.pendingCounts) {
      if (Object.prototype.hasOwnProperty.call(this.pendingCounts, archive)) {
        const count = this.pendingCounts[archive]
        const $inc = { [`${COLLECTIONS.Payloads}.count`]: count }
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
