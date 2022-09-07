import { delay } from '@xylabs/delay'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { isProduction } from '@xyo-network/archivist-middleware'
import {
  debugSchema,
  getArchivePermissionsSchema,
  getDomainConfigSchema,
  getSchemaSchema,
  Query,
  QueryHandler,
  QueryProcessorRegistry,
  setArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import {
  DebugQueryHandler,
  GetArchivePermissionsQueryHandler,
  GetDomainConfigQueryHandler,
  GetSchemaQueryHandler,
  SetArchivePermissionsQueryHandler,
} from '@xyo-network/archivist-query-handlers'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

export const addQueryProcessors = (app: Application) => {
  const registry: QueryProcessorRegistry = app.queryProcessors
  if (!isProduction()) {
    addDebug(registry)
  }
  addQueries(registry)
}

const addDebug = (registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(debugSchema, (payload) => dependencies.get<QueryHandler<Query<XyoPayload>>>(DebugQueryHandler).handle(payload))
  registry.registerProcessorForSchema('network.xyo.test', async () => {
    await delay(1)
    return {} as XyoPayloadWithMeta
  })
}

const addQueries = (registry: QueryProcessorRegistry) => {
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (payload) =>
    dependencies.get<QueryHandler<Query<XyoPayload>>>(SetArchivePermissionsQueryHandler).handle(payload),
  )
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (payload) =>
    dependencies.get<QueryHandler<Query<XyoPayload>>>(GetArchivePermissionsQueryHandler).handle(payload),
  )
  registry.registerProcessorForSchema(getDomainConfigSchema, (payload) =>
    dependencies.get<QueryHandler<Query<XyoPayload>>>(GetDomainConfigQueryHandler).handle(payload),
  )
  registry.registerProcessorForSchema(getSchemaSchema, (payload) =>
    dependencies.get<QueryHandler<Query<XyoPayload>>>(GetSchemaQueryHandler).handle(payload),
  )
}
