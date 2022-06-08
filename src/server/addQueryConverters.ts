import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application, Request } from 'express'
import { v4 } from 'uuid'

import { isProduction, QueryConverterRegistry } from '../middleware'
import {
  DebugPayload,
  DebugQuery,
  debugSchema,
  GetArchivePermissionsPayload,
  GetArchivePermissionsQuery,
  getArchivePermissionsSchema,
  GetDomainConfigPayload,
  GetDomainConfigQuery,
  getDomainConfigSchema,
  GetSchemaPayload,
  GetSchemaQuery,
  getSchemaSchema,
  Query,
  SetArchivePermissionsPayload,
  SetArchivePermissionsQuery,
  setArchivePermissionsSchema,
} from '../model'

const debugCommandConverter = (payload: XyoPayload, _req: Request): Query => {
  return {
    id: v4(),
    payload,
  } as Query
}

export const addQueryConverters = (app: Application) => {
  const registry: QueryConverterRegistry = app.queryConverters
  if (!isProduction()) {
    addDebugQueries(registry)
  }
  addQueryHandlers(app, registry)
}

export const addDebugQueries = (registry: QueryConverterRegistry) => {
  registry.registerConverterForSchema(debugSchema, (x: DebugPayload, _req: Request) => new DebugQuery(x))
  registry.registerConverterForSchema('network.xyo.test', debugCommandConverter)
}

export const addQueryHandlers = (app: Application, registry: QueryConverterRegistry) => {
  registry.registerConverterForSchema(setArchivePermissionsSchema, (x: SetArchivePermissionsPayload, _req: Request) => new SetArchivePermissionsQuery(x))
  registry.registerConverterForSchema(getArchivePermissionsSchema, (x: GetArchivePermissionsPayload, _req: Request) => new GetArchivePermissionsQuery(x))
  registry.registerConverterForSchema(getDomainConfigSchema, (x: GetDomainConfigPayload, _req: Request) => new GetDomainConfigQuery(x))
  registry.registerConverterForSchema(getSchemaSchema, (x: GetSchemaPayload, _req: Request) => new GetSchemaQuery(x))
}
