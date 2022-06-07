import { XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import { GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from '../Handlers'
import { XyoPayloadProcessorRegistry } from '../middleware'
import {
  GetArchivePermissionsPayload,
  getArchivePermissionsSchema,
  GetDomainConfigPayload,
  getDomainConfigSchema,
  GetSchemaPayload,
  getSchemaSchema,
  SetArchivePermissionsPayload,
  setArchivePermissionsSchema,
} from '../model'

export const addSchemaHandlers = (app: Application) => {
  const registry: XyoPayloadProcessorRegistry = app.payloadProcessorRegistry
  addDebugHandlers(registry)
  addCommandHandlers(app, registry)
  addQueryHandlers(app, registry)
}

export const addDebugHandlers = (registry: XyoPayloadProcessorRegistry) => {
  registry.registerProcessorForSchema('network.xyo.debug', () => Promise.resolve())
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
}

export const addCommandHandlers = (app: Application, registry: XyoPayloadProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x: SetArchivePermissionsPayload) => new SetArchivePermissionsQueryHandler({ ...app }).handle(x))
}

export const addQueryHandlers = (app: Application, registry: XyoPayloadProcessorRegistry) => {
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x: GetArchivePermissionsPayload) => new GetArchivePermissionsQueryHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getDomainConfigSchema, (x: GetDomainConfigPayload) => new GetDomainConfigQueryHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getSchemaSchema, (x: GetSchemaPayload) => new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance }).handle(x))
}
