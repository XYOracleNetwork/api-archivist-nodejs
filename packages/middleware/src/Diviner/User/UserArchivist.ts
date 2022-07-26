import { Archivist, User, UserWithoutId } from '@xyo-network/archivist-model'

export type UserArchivist = Archivist<User, UserWithoutId, User | null, string>
