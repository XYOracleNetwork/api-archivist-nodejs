import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { AbstractPayloadRepository } from '../../model'

export type ArchivePayloadRepository<TFilter> = AbstractPayloadRepository<XyoArchive, XyoArchive, TFilter, string, 'network.xyo.archive'>
