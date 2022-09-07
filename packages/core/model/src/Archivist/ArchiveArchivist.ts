import { Archivist, XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../UpsertResult'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type EntityArchive = Required<XyoArchive>

export type ArchiveArchivist = Archivist<
  EntityArchive,
  EntityArchive & UpsertResult,
  EntityArchive,
  EntityArchive,
  XyoPayloadFilterPredicate<XyoArchive>,
  string
>
