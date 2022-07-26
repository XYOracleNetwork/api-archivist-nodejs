import { isProduction, QueryConverterRegistry } from '@xyo-network/archivist-middleware'
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
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'
import { v4 } from 'uuid'

import dependencies from '../inversify.config'

const debugCommandConverter = (payload: XyoPayload, _req: Request): Query => {
  return {
    id: v4(),
    payload,
  } as Query
}

export const addQueryConverters = () => {
  const registry = dependencies.get<QueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry)
  if (!isProduction()) {
    addDebugQueries(registry)
  }
  addQueryHandlers(registry)
}

export const addDebugQueries = (registry: QueryConverterRegistry) => {
  registry.registerConverterForSchema(debugSchema, (payload: XyoQueryPayloadWithMeta<DebugPayload>, _req: Request) => new DebugQuery(payload))
  registry.registerConverterForSchema('network.xyo.test', debugCommandConverter)
}

export const addQueryHandlers = (registry: QueryConverterRegistry) => {
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
