import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter, ObjectId, WithId } from 'mongodb'

import { getBaseMongoSdk, UpsertResult } from '../../../../lib'
import { User, UserWithoutId } from '../../../../model'
import { UserRepository } from '../UserRepository'

interface IUpsertFilter {
  $or: {
    address?: string
    email?: string
  }[]
}

const fromDbEntity = (user: WithId<User>): User => {
  const id = user?._id?.toHexString?.()
  if (id) {
    user.id = id
  }
  delete (user as Partial<WithId<User>>)?._id
  return user
}

const toDbEntity = (user: UserWithoutId) => {
  if (user?.email) {
    user.email = user.email.toLowerCase()
  }
  if (user?.address) {
    user.address = user.address.toLowerCase()
  }
  return user
}

export class MongoDBUserRepository implements UserRepository {
  constructor(protected readonly db: BaseMongoSdk<User> = getBaseMongoSdk<User>('users')) {}

  async find(query: Filter<User>): Promise<WithId<User>[]> {
    return (await this.db.find(query)).toArray()
  }

  async get(id: string): Promise<WithId<User> | null> {
    const user = await this.db.findOne({ _id: new ObjectId(id.toLowerCase()) })
    return user ? user : null
  }

  async insert(user: UserWithoutId): Promise<WithId<User & UpsertResult>> {
    user = toDbEntity(user)
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
