export interface IUser {
  id: string
}
export interface IWeb2User {
  email: string
  passwordHash: string
}
export interface IWeb3User {
  publicKey: string
}

export type User = IUser & Partial<IWeb2User | IWeb3User>

export interface IUserStore<TUser extends IUser> {
  create(user: Omit<TUser, 'id'>): Promise<TUser>
  getById(id: string): Promise<TUser | null>
  getByEmail?(id: string): Promise<TUser | null>
  getByPublicKey?(publicKey: string): Promise<TUser | null>
}

export class InMemoryUserStore implements IUserStore<User> {
  constructor(private lastUserId = 0, private readonly userStore: Record<string, User> = {}) {}

  create(user: Omit<User, 'id'>): Promise<User> {
    const id = `${++this.lastUserId}`
    const userWithId: User = { id, ...user }
    // TODO: Lowercase values here for performance later
    this.userStore[id] = userWithId
    return Promise.resolve(userWithId)
  }
  getById(id: string): Promise<User | null> {
    return Promise.resolve(this.userStore[id])
  }
  getByEmail(email: string): Promise<User | null> {
    if (!email) {
      return Promise.resolve(null)
    }
    const value = email?.toLowerCase()
    const user = Object.values(this.userStore).find((user) => (user as IWeb2User)?.email?.toLowerCase() === value)
    return Promise.resolve(user || null)
  }
  getByPublicKey(publicKey: string): Promise<User | null> {
    if (!publicKey) {
      return Promise.resolve(null)
    }
    const value = publicKey?.toLowerCase()
    const user = Object.values(this.userStore).find((user) => (user as IWeb3User)?.publicKey?.toLowerCase() === value)
    return Promise.resolve(user || null)
  }
}
