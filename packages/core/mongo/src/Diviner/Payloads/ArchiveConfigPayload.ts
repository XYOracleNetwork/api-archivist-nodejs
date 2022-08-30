import { XyoDivinerConfig } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type ArchiveConfigPayload = XyoDivinerConfig<XyoPayload, XyoPayload<{ archive?: string }>>
