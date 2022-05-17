import { Application } from 'express'

import { XyoPayloadProcessorRegistry } from './XyoPayloadProcessorRegistry'
import { XyoSchemaToPayloadProcessorRegistry } from './XyoSchemaToPayloadProcessorRegistry'

export const usePayloadProcessors = (app: Application, registry: XyoPayloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)) => {
  app.payloadProcessorRegistry = registry
}
