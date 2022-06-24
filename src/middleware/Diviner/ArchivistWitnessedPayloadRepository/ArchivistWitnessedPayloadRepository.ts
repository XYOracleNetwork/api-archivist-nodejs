import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from '../../../model'

export type ArchivistWitnessedPayloadRepository = Repository<XyoPayload[], XyoPayload[], XyoPayload[] | null, string>
