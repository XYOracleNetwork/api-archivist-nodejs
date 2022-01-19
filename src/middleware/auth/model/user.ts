export interface IIdentifiable {
  id: string
}
export interface IWeb2User {
  email: string
  passwordHash: string
}
export interface IWeb3User {
  address: string
}

export type UserWithoutId = Partial<IWeb2User> & Partial<IWeb3User>
export type User = IIdentifiable & UserWithoutId
