import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type PayloadProcessor<T extends XyoPayload = XyoPayload, R extends XyoPayload = XyoPayload> = (x: T) => Promise<R>
