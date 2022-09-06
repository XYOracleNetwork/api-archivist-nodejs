import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { _Archivist } from './Archivist'

export type WitnessedPayloadArchivist = _Archivist<XyoPayloadWithMeta[], XyoPayloadWithMeta[], XyoPayloadWithMeta[] | null, string>
