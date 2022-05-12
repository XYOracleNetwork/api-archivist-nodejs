import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { AbstractPayloadRepository, XyoStoredPayload } from '../../model'

export type ArchivePayloadRepository<TFilter> = AbstractPayloadRepository<XyoArchive, XyoStoredPayload<XyoArchive>, TFilter, string, 'network.xyo.archive'>
