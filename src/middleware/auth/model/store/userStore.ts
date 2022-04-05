import { UpsertResult } from '../../../../lib'
import { User, UserWithoutId } from '../user'

export interface UserStore {
  create(user: UserWithoutId): Promise<User & UpsertResult>
  getById(id: string): Promise<User | null>
  getByEmail(id: string): Promise<User | null>
  getByWallet(address: string): Promise<User | null>
}
