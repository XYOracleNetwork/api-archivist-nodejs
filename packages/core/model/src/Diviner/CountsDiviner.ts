import { XyoDiviner, XyoPayload, XyoQueryPayload } from '@xyo-network/sdk-xyo-client-js'

export type CountsPayload = XyoPayload<XyoPayload & { count: number }>
export type CountsQueryPayload = XyoQueryPayload<XyoPayload & { archive?: string }>

export type CountsDiviner = XyoDiviner<CountsQueryPayload>
