import { Archivist, XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../../../model'

export type EntityArchive = Required<XyoArchive>

export type ArchiveArchivist = Archivist<EntityArchive & UpsertResult, EntityArchive, EntityArchive | null, string>
