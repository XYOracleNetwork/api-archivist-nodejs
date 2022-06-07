import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application, Request } from 'express'
import { v4 } from 'uuid'

import { RequestToQueryConverterRegistry } from '../middleware'
import {
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
    id: () => v4(),
    payload,
  } as Query
}

export const addRequestToQueryConverters = (app: Application) => {
  const registry: RequestToQueryConverterRegistry = app.requestToQueryConverterRegistry
  addDebugQueries(registry)
  addQueryHandlers(app, registry)
}

export const addDebugQueries = (registry: RequestToQueryConverterRegistry) => {
  registry.registerConverterForSchema('network.xyo.debug', debugCommandConverter)
  registry.registerConverterForSchema('network.xyo.test', debugCommandConverter)
}

export const addQueryHandlers = (app: Application, registry: RequestToQueryConverterRegistry) => {
  registry.registerConverterForSchema(setArchivePermissionsSchema, (x: SetArchivePermissionsPayload, _req: Request) => new SetArchivePermissionsQuery(x))
  registry.registerConverterForSchema(getArchivePermissionsSchema, (x: GetArchivePermissionsPayload, _req: Request) => new GetArchivePermissionsQuery(x))
  registry.registerConverterForSchema(getDomainConfigSchema, (x: GetDomainConfigPayload, _req: Request) => new GetDomainConfigQuery(x))
  registry.registerConverterForSchema(getSchemaSchema, (x: GetSchemaPayload, _req: Request) => new GetSchemaQuery(x))
}
