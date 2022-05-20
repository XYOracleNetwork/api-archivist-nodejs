import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../../../lib'
import { Repository } from '../../../model'

export type EntityArchive = Required<XyoArchive>

export type ArchiveRepository = Repository<EntityArchive & UpsertResult, EntityArchive, EntityArchive | null, string>
