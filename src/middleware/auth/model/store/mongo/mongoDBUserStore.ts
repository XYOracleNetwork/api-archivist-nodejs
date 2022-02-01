import { WithId } from 'mongodb'

import { User, UserWithoutId } from '../../user'
import { IUserStore } from '../userStore'
import { getUserMongoSdk } from './getUserMongoSdk'

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

export class MongoDBUserStore implements IUserStore {
  async create(user: UserWithoutId): Promise<User> {
    const sdk = await getUserMongoSdk()
    const created = await sdk.upsert(toDbEntity(user))
    return fromDbEntity(created)
  }
  getById(_id: string): Promise<User | null> {
    throw new Error('getById not implemented for this user store')
  }
  async getByEmail(email: string): Promise<User | null> {
    const sdk = await getUserMongoSdk()
    const user = await sdk.findByEmail(email.toLowerCase())
    return user ? fromDbEntity(user) : null
  }
  async getByWallet(address: string): Promise<User | null> {
    const sdk = await getUserMongoSdk()
    const user = await sdk.findByAddress(address.toLowerCase())
    return user ? fromDbEntity(user) : null
  }
}
