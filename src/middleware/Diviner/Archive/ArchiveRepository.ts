import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../../../lib'
import { ReadWriteRepository } from '../../../model'

export type ArchiveRepository = ReadWriteRepository<XyoArchive & UpsertResult, XyoArchive, XyoArchive | null, string>
