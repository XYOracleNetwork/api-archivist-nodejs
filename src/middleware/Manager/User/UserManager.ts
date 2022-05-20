import { UpsertResult } from '../../../lib'
import { User, UserWithoutId } from '../../../model'

export interface UserManager {
  create(user: UserWithoutId, password?: string): Promise<User & UpsertResult>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findByWallet(address: string): Promise<User | null>
}
