import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { getBaseMongoSdk } from '../../../lib'
import { ArchiveRepository } from './ArchiveRepository'

export class MongoDBArchiveRepository implements ArchiveRepository {
  constructor(protected archives: BaseMongoSdk<XyoArchive> = getBaseMongoSdk<XyoArchive>('archives')) {}

  get(name: string): Promise<XyoArchive | null> {
    return this.archives.findOne({ archive: name })
  }

  insert(item: XyoArchive): Promise<XyoArchive> {
    throw new Error('Not implemented exception')
  }
}
