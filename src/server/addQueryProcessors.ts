import { XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import { isProduction, QueryProcessorRegistry } from '../middleware'
import {
  DebugQuery,
  debugSchema,
  GetArchivePermissionsQuery,
  getArchivePermissionsSchema,
  GetDomainConfigQuery,
  getDomainConfigSchema,
  GetSchemaQuery,
  getSchemaSchema,
  SetArchivePermissionsQuery,
  setArchivePermissionsSchema,
} from '../model'
import { DebugQueryHandler, GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from '../QueryHandlers'

export const addQueryProcessors = (app: Application) => {
  const registry: QueryProcessorRegistry = app.queryProcessors
  if (!isProduction()) {
    addDebug(registry)
  }
  addQueries(app, registry)
}

const addDebug = (registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(debugSchema, (x) => new DebugQueryHandler().handle(x as DebugQuery))
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
}

const addQueries = (app: Application, registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x) => new SetArchivePermissionsQueryHandler({ ...app }).handle(x as SetArchivePermissionsQuery))
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x) => new GetArchivePermissionsQueryHandler({ ...app }).handle(x as GetArchivePermissionsQuery))
  registry.registerProcessorForSchema(getDomainConfigSchema, (x) => new GetDomainConfigQueryHandler({ ...app }).handle(x as GetDomainConfigQuery))
  registry.registerProcessorForSchema(getSchemaSchema, (x) => new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance }).handle(x as GetSchemaQuery))
}
