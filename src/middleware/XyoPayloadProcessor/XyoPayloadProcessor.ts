import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type XyoPayloadProcessor<T extends XyoPayload = XyoPayload, R = unknown> = (x: T) => Promise<R>
