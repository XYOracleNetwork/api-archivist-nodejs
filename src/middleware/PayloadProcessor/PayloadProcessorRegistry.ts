import { PayloadProcessor } from './PayloadProcessor'

export interface PayloadProcessorRegistry {
  processors: Record<string, PayloadProcessor>
  registerProcessorForSchema: (schema: string, processor: PayloadProcessor) => void
}
