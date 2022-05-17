import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type XyoPayloadProcessor<T extends XyoPayload = XyoPayload, R extends XyoPayload = XyoPayload> = (x: T) => Promise<R>
