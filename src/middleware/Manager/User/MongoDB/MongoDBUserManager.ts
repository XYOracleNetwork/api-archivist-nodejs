import { WithId } from 'mongodb'

import { UpsertResult } from '../../../../lib'
import { Identifiable, User, UserWithoutId, Web2User, Web3User } from '../../../../model'
import { passwordHasher } from '../../../auth/model'
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
  async create(user: UserWithoutId, password?: string): Promise<Identifiable & Partial<Web2User> & Partial<Web3User> & UpsertResult> {
    if (password) {
      user.passwordHash = await passwordHasher.hash(password)
    }
    const created = await this.mongo.insert(toDbEntity(user))
    return { ...fromDbEntity(created), updated: created.updated }
  }
  async findByEmail(email: string): Promise<User | null> {
    email = email.toLowerCase()
    const user = await this.mongo.find({ email })
    return user.length ? fromDbEntity(user[0]) : null
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.mongo.get(id)
    return user ? fromDbEntity(user) : null
  }
  async findByWallet(address: string): Promise<User | null> {
    address = address.toLowerCase()
    const user = await this.mongo.find({ address })
    return user.length ? fromDbEntity(user[0]) : null
  }
}
