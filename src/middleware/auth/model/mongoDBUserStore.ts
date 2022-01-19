import { IUserStore, User } from '.'
import { UserMongoSdk } from './userSdk'

interface ToHexStringable {
  toHexString(): string
}
interface WithId extends User {
  _id?: ToHexStringable
}
const toEntity = (user: User) => {
  const fromDb = user as WithId
  const id = fromDb?._id?.toHexString()
  if (id) {
    user.id = id
    delete (user as WithId)?._id
  }
  return user
}
const fromEntity = (user: Omit<User, 'id'>) => {
  if (user.email) {
    user.email = user.email.toLowerCase()
  }
  if (user.address) {
    user.address = user.address.toLowerCase()
  }
  return user
}

export class MongoDBUserStore implements IUserStore<User> {
  constructor(private readonly mongo: UserMongoSdk) {}
  async create(user: Omit<User, 'id'>): Promise<User> {
    user = fromEntity(user)
    const id = await this.mongo.upsert(user as User)
    return { id, ...user }
  }
  getById(_id: string): Promise<User | null> {
    throw new Error('Not implemented')
  }
  async getByEmail(email: string): Promise<User | null> {
    const user = await this.mongo.findByEmail(email.toLowerCase())
    return user ? toEntity(user) : null
  }
  async getByWallet(address: string): Promise<User | null> {
    const user = await this.mongo.findByAddress(address.toLowerCase())
    return user ? toEntity(user) : null
  }
}
