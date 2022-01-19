import { IUser } from '../user'

export interface IUserStore<TUser extends IUser> {
  create(user: Omit<TUser, 'id'>): Promise<TUser>
  getById(id: string): Promise<TUser | null>
  getByEmail?(id: string): Promise<TUser | null>
  getByWallet?(address: string): Promise<TUser | null>
}
