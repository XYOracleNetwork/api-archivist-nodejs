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

export type User = IUser & Partial<IWeb2User> & Partial<IWeb3User>
