export interface IUser {
  id: string
}
export interface IWeb2User {
  email: string
  passwordHash: string
}
export interface IWeb3User {
  address: string
}

export type User = IUser & Partial<IWeb2User | IWeb3User>

export interface IUserStore<TUser extends IUser> {
  create(user: Omit<TUser, 'id'>): Promise<TUser>
  getById(id: string): Promise<TUser | null>
  getByEmail?(id: string): Promise<TUser | null>
  getByWallet?(address: string): Promise<TUser | null>
}
