import { Archivist, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

export type WitnessedPayloadArchivist = Archivist<XyoPayloadWithMeta[], XyoPayloadWithMeta[], XyoPayloadWithMeta[] | null, string>
