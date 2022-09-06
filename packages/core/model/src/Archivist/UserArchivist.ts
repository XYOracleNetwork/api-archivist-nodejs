import { Archivist } from '@xyo-network/sdk-xyo-client-js'

import { User, UserWithoutId } from '../Domain'

export type UserArchivist = Archivist<User | null, User, UserWithoutId, User[]>
