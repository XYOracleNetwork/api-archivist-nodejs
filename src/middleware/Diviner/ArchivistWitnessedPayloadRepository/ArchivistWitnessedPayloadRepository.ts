import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Repository } from '../../../model'

export type ArchivistWitnessedPayloadRepository = Repository<XyoPayloadWithMeta[], XyoPayloadWithMeta[], XyoPayloadWithMeta[] | null, string>
