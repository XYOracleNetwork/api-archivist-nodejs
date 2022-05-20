import { UpsertResult } from '../../../lib'
import { User, UserWithoutId } from '../../../model'

export interface UserManager {
  create(user: UserWithoutId): Promise<User & UpsertResult>
  getByEmail(email: string): Promise<User | null>
  getById(id: string): Promise<User | null>
  getByWallet(address: string): Promise<User | null>
}
