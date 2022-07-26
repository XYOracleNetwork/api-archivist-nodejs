import { Archivist } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

export type WitnessedPayloadArchivist = Archivist<XyoPayloadWithMeta[], XyoPayloadWithMeta[], XyoPayloadWithMeta[] | null, string>
