import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type SchemaHandler<T extends XyoPayload = XyoPayload, R extends XyoPayload = XyoPayload> = (x: T) => Promise<R>
