import { BaseMongoSdk, BaseMongoSdkConfig } from '@xyo-network/sdk-xyo-mongo-js'
import { WithId } from 'mongodb'

import { UpsertResult } from '../../../../../lib'
import { User, UserWithoutId } from '../../../../../model'

interface IUpsertFilter {
  $or: {
    address?: string
    email?: string
  }[]
}

class UserMongoSdk extends BaseMongoSdk<User> {
  constructor(config: BaseMongoSdkConfig) {
    super(config)
  }

  public async upsert(user: UserWithoutId): Promise<WithId<User & UpsertResult>> {
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
      const result = await collection.findOneAndUpdate(filter, { $set: user }, { returnDocument: 'after', upsert: true })
      if (result.ok && result.value) {
        const updated = !!result?.lastErrorObject?.updatedExisting || false
        return { ...result.value, updated }
      }
      throw new Error('Insert Failed')
    })
  }
}

export { UserMongoSdk }
