import { delay } from '@xylabs/sdk-js'
import { isProduction, QueryProcessorRegistry } from '@xyo-network/archivist-middleware'
import { debugSchema, getArchivePermissionsSchema, getDomainConfigSchema, getSchemaSchema, Query, QueryHandler, setArchivePermissionsSchema } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import dependencies from '../inversify.config'
import { DebugQueryHandler, GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from '../QueryHandlers'

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
    dependencies.get<QueryHandler<Query<XyoPayload>>>(SetArchivePermissionsQueryHandler).handle(payload)
  )
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (payload) =>
    dependencies.get<QueryHandler<Query<XyoPayload>>>(GetArchivePermissionsQueryHandler).handle(payload)
  )
  registry.registerProcessorForSchema(getDomainConfigSchema, (payload) => dependencies.get<QueryHandler<Query<XyoPayload>>>(GetDomainConfigQueryHandler).handle(payload))
  registry.registerProcessorForSchema(getSchemaSchema, (payload) => dependencies.get<QueryHandler<Query<XyoPayload>>>(GetSchemaQueryHandler).handle(payload))
}
