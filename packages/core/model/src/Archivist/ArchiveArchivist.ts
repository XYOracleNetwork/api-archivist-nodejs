import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../UpsertResult'
import { Archivist } from './Archivist'

export type EntityArchive = Required<XyoArchive>

export type ArchiveArchivist = Archivist<EntityArchive & UpsertResult, EntityArchive, EntityArchive | null, string, EntityArchive[]>
