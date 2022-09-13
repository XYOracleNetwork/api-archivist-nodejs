import { Archivist } from '@xyo-network/sdk-xyo-client-js'

import { User, UserWithoutId } from '../Domain'
import { UpsertResult } from '../UpsertResult'

export type UserArchivist = Archivist<User, User & UpsertResult, UserWithoutId, User, Partial<User>>
