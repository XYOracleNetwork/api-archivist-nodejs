import { Archivist } from '@xyo-network/sdk-xyo-client-js'

import { User, UserWithoutId } from '../../../model'

export type UserArchivist = Archivist<User, UserWithoutId, User | null, string>
