import 'reflect-metadata'

import { UpsertResult, User, UserWithoutId } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, ObjectId, WithId } from 'mongodb'

import { UserArchivist } from '../UserArchivist'

interface IUpsertFilter {
  $or: {
    address?: string
    email?: string
  }[]
}

@injectable()
export class MongoDBUserArchivist implements UserArchivist {
  constructor(@inject(TYPES.UserSdkMongo) protected readonly db: BaseMongoSdk<User>) {}

  async find(query: Filter<User>): Promise<WithId<User>[]> {
    return (await this.db.find(query)).limit(100).toArray()
  }

  async get(id: string): Promise<WithId<User> | null> {
    const user = await this.db.findOne({ _id: new ObjectId(id.toLowerCase()) })
    return user ? user : null
  }

  async insert(user: UserWithoutId): Promise<WithId<User & UpsertResult>> {
    return await this.db.useCollection(async (collection) => {
      const filter: IUpsertFilter = { $or: [] }
      const { address, email } = user
      if (!address && !email) {
        throw new Error('Invalid user creation attempted. Either email or address is required.')
      }
      if (address) {
        filter.$or.push({ address })
      }
      if (email) {
        filter.$or.push({ email })
      }
      const result = await collection.findOneAndUpdate(filter, { $set: user }, { returnDocument: 'after', upsert: true })
      if (result.ok && result.value) {
        const updated = !!result?.lastErrorObject?.updatedExisting || false
        return { ...result.value, updated }
      }
      throw new Error('Insert Failed')
    })
  }
}
