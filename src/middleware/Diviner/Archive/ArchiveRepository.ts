import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { UpsertResult } from '../../../lib'
import { ReadWriteRepository } from '../../../model'

export type ArchiveRepository = ReadWriteRepository<Required<XyoArchive> & UpsertResult, Required<XyoArchive>, Required<XyoArchive> | null, string>
