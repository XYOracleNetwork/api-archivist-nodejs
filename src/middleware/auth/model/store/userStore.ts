import { User, UserWithoutId } from '../user'

export interface IUserStore {
  create(user: UserWithoutId): Promise<User>
  getById(id: string): Promise<User | null>
  getByEmail?(id: string): Promise<User | null>
  getByWallet?(address: string): Promise<User | null>
}
