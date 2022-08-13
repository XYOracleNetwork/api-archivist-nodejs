import { ArchiveKeyArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
@injectable()
export class MongoDBArchiveKeyArchivist implements ArchiveKeyArchivist {
  constructor(@inject(TYPES.ArchiveKeySdkMongo) protected readonly keys: BaseMongoSdk<string>) {}
  find(query: unknown): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
  get(id: string): Promise<string[] | null> {
    throw new Error('Method not implemented.')
  }
  insert(item: string[]): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
}
