import { XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import { GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from '../Handlers'
import { QueryProcessorRegistry } from '../middleware'
import {
  GetArchivePermissionsQuery,
  getArchivePermissionsSchema,
  GetDomainConfigQuery,
  getDomainConfigSchema,
  GetSchemaQuery,
  getSchemaSchema,
  SetArchivePermissionsQuery,
  setArchivePermissionsSchema,
} from '../model'

export const addSchemaHandlers = (app: Application) => {
  const registry: QueryProcessorRegistry = app.payloadProcessorRegistry
  addDebugHandlers(registry)
  addCommandHandlers(app, registry)
  addQueryHandlers(app, registry)
}

export const addDebugHandlers = (registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema('network.xyo.debug', () => Promise.resolve())
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
}

export const addCommandHandlers = (app: Application, registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x: SetArchivePermissionsQuery) => new SetArchivePermissionsQueryHandler({ ...app }).handle(x))
}

export const addQueryHandlers = (app: Application, registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x: GetArchivePermissionsQuery) => new GetArchivePermissionsQueryHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getDomainConfigSchema, (x: GetDomainConfigQuery) => new GetDomainConfigQueryHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getSchemaSchema, (x: GetSchemaQuery) => new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance }).handle(x))
}
