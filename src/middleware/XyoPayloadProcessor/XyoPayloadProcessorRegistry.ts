import { XyoPayloadProcessor } from './XyoPayloadProcessor'

export interface XyoPayloadProcessorRegistry {
  processors: Readonly<Record<string, XyoPayloadProcessor>>
  registerProcessorForSchema: (schema: string, processor: XyoPayloadProcessor) => void
}
