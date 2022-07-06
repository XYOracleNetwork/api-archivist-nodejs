import { XyoPayload, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
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
  registry.registerConverterForSchema(debugSchema, (payload: XyoQueryPayloadWithMeta<DebugPayload>, _req: Request) => new DebugQuery(payload))
  registry.registerConverterForSchema('network.xyo.test', debugCommandConverter)
}

export const addQueryHandlers = (app: Application, registry: QueryConverterRegistry) => {
  registry.registerConverterForSchema(
    setArchivePermissionsSchema,
    (payload: XyoQueryPayloadWithMeta<SetArchivePermissionsPayload>, _req: Request) => new SetArchivePermissionsQuery(payload)
  )
  registry.registerConverterForSchema(
    getArchivePermissionsSchema,
    (payload: XyoQueryPayloadWithMeta<GetArchivePermissionsPayload>, _req: Request) => new GetArchivePermissionsQuery(payload)
  )
  registry.registerConverterForSchema(getDomainConfigSchema, (payload: XyoQueryPayloadWithMeta<GetDomainConfigPayload>, _req: Request) => new GetDomainConfigQuery(payload))
  registry.registerConverterForSchema(getSchemaSchema, (payload: XyoQueryPayloadWithMeta<GetSchemaPayload>, _req: Request) => new GetSchemaQuery(payload))
}
