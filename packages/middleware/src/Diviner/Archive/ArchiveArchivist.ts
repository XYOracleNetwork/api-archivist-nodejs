import { Archivist, UpsertResult } from '@xyo-network/archivist-model'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

export type EntityArchive = Required<XyoArchive>

export type ArchiveArchivist = Archivist<EntityArchive & UpsertResult, EntityArchive, EntityArchive | null, string>
