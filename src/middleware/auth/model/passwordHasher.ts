import { compare, hash } from 'bcrypt'

import { User } from './user'

export interface IPasswordHasher<TUser> {
  hash(password: string): Promise<string>
  verify(user: TUser, providedPassword: string): Promise<boolean>
}

const bcryptPasswordHasher: IPasswordHasher<User> = {
  hash: (password: string) => {
    return hash(password, 10)
  },
  verify: (user: User, providedPassword: string) => {
    if (!user.passwordHash) {
      return Promise.resolve(false)
    }
    return compare(providedPassword, user.passwordHash)
  },
}

// TODO: Move to PBKDF

export const passwordHasher: IPasswordHasher<User> = bcryptPasswordHasher
