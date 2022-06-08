import { XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

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
import { GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from '../QueryHandlers'

export const addQueryProcessors = (app: Application) => {
  const registry: QueryProcessorRegistry = app.queryProcessors
  addDebug(registry)
  addQueries(app, registry)
}

const addDebug = (registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema('network.xyo.debug', () => Promise.resolve())
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
}

const addQueries = (app: Application, registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x) => new SetArchivePermissionsQueryHandler({ ...app }).handle(x as SetArchivePermissionsQuery))
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x) => new GetArchivePermissionsQueryHandler({ ...app }).handle(x as GetArchivePermissionsQuery))
  registry.registerProcessorForSchema(getDomainConfigSchema, (x) => new GetDomainConfigQueryHandler({ ...app }).handle(x as GetDomainConfigQuery))
  registry.registerProcessorForSchema(getSchemaSchema, (x) => new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance }).handle(x as GetSchemaQuery))
}
