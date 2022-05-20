import { Repository, User, UserWithoutId } from '../../../model'

export type UserRepository = Repository<User, UserWithoutId, User | null, string>
