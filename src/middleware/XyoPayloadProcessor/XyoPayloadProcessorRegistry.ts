import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { XyoPayloadProcessor } from './XyoPayloadProcessor'

export interface XyoPayloadProcessorRegistry {
  processors: Readonly<Record<string, XyoPayloadProcessor>>
  registerProcessorForSchema: <T extends XyoPayload = XyoPayload, R = unknown>(schema: string, processor: XyoPayloadProcessor<T, R>) => void
}
