import { ObjectId, WithId } from 'mongodb'

import { UpsertResult } from '../../../../lib'
import { Identifiable, User, UserWithoutId, Web2User, Web3User } from '../../../../model'
import { MongoDBUserRepository } from '../../../Diviner'
import { UserManager } from '../UserManager'

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

export class MongoDBUserManager implements UserManager {
  constructor(protected mongo: MongoDBUserRepository) {}
  create(user: UserWithoutId): Promise<Identifiable & Partial<Web2User> & Partial<Web3User> & UpsertResult> {
    throw new Error('Not Implemented')
  }
  async getByEmail(email: string): Promise<User | null> {
    email = email.toLowerCase()
    const user = await this.mongo.find({ email })
    return user.length ? fromDbEntity(user[0]) : null
  }
  async getById(id: string): Promise<User | null> {
    const user = await this.mongo.find({ _id: new ObjectId(id.toLowerCase()) })
    return user.length ? fromDbEntity(user[0]) : null
  }
  async getByWallet(address: string): Promise<User | null> {
    address = address.toLowerCase()
    const user = await this.mongo.find({ address })
    return user.length ? fromDbEntity(user[0]) : null
  }
}
