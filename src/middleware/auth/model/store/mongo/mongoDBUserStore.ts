import { WithId } from 'mongodb'

import { UpsertResult } from '../../../../../lib'
import { User, UserWithoutId } from '../../../../../model'
import { UserStore } from '../userStore'
import { UserMongoSdk } from './userSdk'

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

/**
 * @deprecated Use app.userManager instead
 */
export class MongoDBUserStore implements UserStore {
  constructor(private readonly mongo: UserMongoSdk) {}
  async create(user: UserWithoutId): Promise<User & UpsertResult> {
    const created = await this.mongo.upsert(toDbEntity(user))
    return { ...fromDbEntity(created), updated: created.updated }
  }
}
