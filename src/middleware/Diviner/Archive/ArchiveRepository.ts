import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { ReadWriteRepository } from '../../../model'

export type ArchiveRepository = ReadWriteRepository<XyoArchive, XyoArchive | null, string>
