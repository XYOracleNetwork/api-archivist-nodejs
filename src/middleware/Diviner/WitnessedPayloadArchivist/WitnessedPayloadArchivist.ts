import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { Archivist } from '../../../model'

export type WitnessedPayloadArchivist = Archivist<XyoPayloadWithMeta[], XyoPayloadWithMeta[], XyoPayloadWithMeta[] | null, string>
