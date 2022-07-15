import { Archivist, User, UserWithoutId } from '../../../model'

export type UserArchivist = Archivist<User, UserWithoutId, User | null, string>
