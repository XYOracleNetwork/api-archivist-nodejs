import { User, UserWithoutId } from '../Domain'
import { _Archivist } from './Archivist'

export type UserArchivist = _Archivist<User, UserWithoutId, User | null, string, User[]>
