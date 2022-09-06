import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../UpsertResult'
import { _Archivist } from './Archivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type EntityArchive = Required<XyoArchive>

export type ArchiveArchivist = _Archivist<
  EntityArchive & UpsertResult,
  EntityArchive,
  EntityArchive | null,
  string,
  EntityArchive[],
  XyoPayloadFilterPredicate<XyoArchive>
>
