import { XyoDivinerConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type ArchiveConfigPayload = XyoDivinerConfig<XyoPayload, XyoPayload<{ archive?: string }>>
