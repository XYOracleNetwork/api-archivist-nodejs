import { delay } from '@xylabs/sdk-js'
import { XyoPayloadWithMeta, XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
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
  registry.registerProcessorForSchema(debugSchema, (payload) => new DebugQueryHandler().handle(payload as DebugQuery))
  registry.registerProcessorForSchema('network.xyo.test', async () => {
    await delay(1)
    return {} as XyoPayloadWithMeta
  })
}

const addQueries = (app: Application, registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (payload) =>
    new SetArchivePermissionsQueryHandler(app.archivePermissionsArchivist).handle(payload as SetArchivePermissionsQuery)
  )
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (payload) => new GetArchivePermissionsQueryHandler({ ...app }).handle(payload as GetArchivePermissionsQuery))
  registry.registerProcessorForSchema(getDomainConfigSchema, (payload) => new GetDomainConfigQueryHandler({ ...app }).handle(payload as GetDomainConfigQuery))
  registry.registerProcessorForSchema(getSchemaSchema, (payload) => new GetSchemaQueryHandler({ schemaArchivist: XyoSchemaCache.instance }).handle(payload as GetSchemaQuery))
}
