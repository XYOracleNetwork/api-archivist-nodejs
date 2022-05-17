import { Application } from 'express'

import { DefaultXyoPayloadProcessorRegistry } from './DefaultXyoPayloadProcessor'
import { XyoPayloadProcessorRegistry } from './XyoPayloadProcessorRegistry'

export const usePayloadProcessors = (app: Application, registry: XyoPayloadProcessorRegistry = new DefaultXyoPayloadProcessorRegistry(app)) => {
  app.payloadProcessorRegistry = registry
}
