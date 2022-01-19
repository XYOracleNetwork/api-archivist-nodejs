import { WithId } from 'mongodb'

import { User, UserWithoutId } from '../../user'
import { IUserStore } from '../userStore'
import { UserMongoSdk } from './userSdk'

const fromDbEntity = (user: WithId<User>): User => {
  if (user?._id) {
    const id = user?._id?.toHexString()
    user.id = id
    delete (user as Partial<WithId<User>>)?._id
  }
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

export class MongoDBUserStore implements IUserStore {
  constructor(private readonly mongo: UserMongoSdk) {}
  async create(user: UserWithoutId): Promise<User> {
    const created = await this.mongo.upsert(toDbEntity(user))
    return fromDbEntity(created)
  }
  getById(_id: string): Promise<User | null> {
    throw new Error('Not implemented')
  }
  async getByEmail(email: string): Promise<User | null> {
    const user = await this.mongo.findByEmail(email.toLowerCase())
    return user ? fromDbEntity(user) : null
  }
  async getByWallet(address: string): Promise<User | null> {
    const user = await this.mongo.findByAddress(address.toLowerCase())
    return user ? fromDbEntity(user) : null
  }
}
