import 'reflect-metadata'

import { ArchiveArchivist, ArchiveSchemaListDiviner, Job, JobProvider } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

// TODO: Make into Diviner via plugin interface
@injectable()
export class MongoDBArchiveSchemaListDiviner implements ArchiveSchemaListDiviner, JobProvider {
  protected readonly batchLimit = 100
  protected nextOffset = 0

  constructor(
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>,
  ) {}

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBArchiveSchemaListDiviner.UpdateChanges',
        onSuccess: () => async () => await Promise.resolve(),
        schedule: '1 minute',
        task: async () => await Promise.resolve(),
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
}
