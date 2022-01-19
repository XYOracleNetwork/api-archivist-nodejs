import { IUserStore, User } from '.'
import { UserMongoSdk } from './userSdk'

export class MongoDBUserStore implements IUserStore<User> {
  constructor(private readonly mongo: UserMongoSdk) {}
  async create(user: Omit<User, 'id'>): Promise<User> {
    if (user.email) {
      user.email = user.email.toLowerCase()
    }
    if (user.address) {
      user.address = user.address.toLowerCase()
    }
    const id = await this.mongo.upsert(user as User)
    return { id, ...user }
  }
  getById(_id: string): Promise<User | null> {
    throw new Error('Not implemented')
  }
  async getByEmail(email: string): Promise<User | null> {
    const user = await this.mongo.findByEmail(email.toLowerCase())
    return user
  }
  async getByWallet(address: string): Promise<User | null> {
    const user = await this.mongo.findByAddress(address.toLowerCase())
    return user
  }
}
