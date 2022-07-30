import { User, UserWithoutId } from '../Domain'
import { Archivist } from './Archivist'

export type UserArchivist = Archivist<User, UserWithoutId, User | null, string>
