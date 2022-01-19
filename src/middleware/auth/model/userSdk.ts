import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection } from 'mongodb'

import { User } from '.'

interface IUpsertFilter {
  $or: {
    email?: string
    address?: string
  }[]
}

class UserMongoSdk extends BaseMongoSdk<User> {
  constructor(config: BaseMongoSdkConfig, private readonly _maxTime = 2000) {
    super(config)
  }

  public async upsert(user: User): Promise<string> {
    return await this.useCollection(async (collection: Collection<User>) => {
      const filter: IUpsertFilter = { $or: [] }
      const { address, email } = user
      if (!address && !email) {
        throw new Error('Invalid user creation attempted. Missing email & address.')
      }
      if (address) {
        filter.$or.push({ address })
      }
      if (email) {
        filter.$or.push({ email })
      }
      const result = await collection.findOneAndUpdate(filter, { $set: user }, { upsert: true })
      if (result.ok) {
        return (result.value as any)._id.toHexString()
      } else {
        throw new Error('Insert Failed')
      }
    })
  }

  public async findByAddress(address: string) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.findOne({ address }, { maxTimeMS: this._maxTime })
    })
  }

  public async updateByAddress(address: string, user: User) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.updateOne({ address }, { $set: user }, { maxTimeMS: this._maxTime })
    })
  }

  public async findByEmail(email: string) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.findOne({ email }, { maxTimeMS: this._maxTime })
    })
  }

  public async updateByEmail(email: string, user: User) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.updateOne({ email }, { $set: user }, { maxTimeMS: this._maxTime })
    })
  }
}

export { UserMongoSdk }
