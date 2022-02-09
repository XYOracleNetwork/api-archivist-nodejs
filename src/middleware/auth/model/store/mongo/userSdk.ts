import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { Collection, ObjectId, WithId } from 'mongodb'

import { User, UserWithoutId } from '../../user'

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

  public async upsert(user: UserWithoutId): Promise<WithId<User>> {
    return await this.useCollection(async (collection) => {
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
      const result = await collection.findOneAndUpdate(
        filter,
        { $set: user },
        { returnDocument: 'after', upsert: true }
      )
      if (result.ok && result.value) {
        const created = result.value as WithId<User>
        if (created?._id) {
          return created
        }
      }
      throw new Error('Insert Failed')
    })
  }

  public async findByAddress(address: string) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.findOne({ address }, { maxTimeMS: this._maxTime })
    })
  }

  public async findByEmail(email: string) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.findOne({ email }, { maxTimeMS: this._maxTime })
    })
  }

  public async findById(id: string) {
    return await this.useCollection(async (collection: Collection<User>) => {
      return await collection.findOne({ _id: new ObjectId(id) }, { maxTimeMS: this._maxTime })
    })
  }
}

export { UserMongoSdk }
