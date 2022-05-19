import { XyoPayloadProcessorRegistry } from './XyoPayloadProcessorRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      payloadProcessorRegistry: XyoPayloadProcessorRegistry
    }
  }
}

export * from './XyoPayloadProcessor'
export * from './XyoPayloadProcessorRegistry'
export * from './XyoSchemaToPayloadProcessorRegistry'
