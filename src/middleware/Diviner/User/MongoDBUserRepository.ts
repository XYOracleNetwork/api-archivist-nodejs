import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter, WithId } from 'mongodb'

import { getBaseMongoSdk, UpsertResult } from '../../../lib'
import { User, UserWithoutId } from '../../../model'
import { UserRepository } from './UserRepository'

interface IUpsertFilter {
  $or: {
    address?: string
    email?: string
  }[]
}

export class MongoDBUserRepository implements UserRepository {
  constructor(protected db: BaseMongoSdk<User> = getBaseMongoSdk<User>('users')) {}

  async find(query: Filter<User>): Promise<User[]> {
    return (await this.db.find(query)).toArray()
  }

  get(name: string): Promise<User | null> {
    return this.db.findOne({ archive: name })
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
