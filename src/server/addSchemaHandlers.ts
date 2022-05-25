import { Application } from 'express'

import { GetArchivePermissionsQueryHandler, SetArchivePermissionsCommandHandler } from '../Handlers'
import { XyoPayloadProcessorRegistry } from '../middleware'
import { getArchivePermissionsSchema, setArchivePermissionsSchema } from '../model'

export const addSchemaHandlers = (app: Application) => {
  const registry: XyoPayloadProcessorRegistry = app.payloadProcessorRegistry
  registry.registerProcessorForSchema('network.xyo.debug', () => Promise.resolve())
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x) => new SetArchivePermissionsCommandHandler({ ...app }).handle({ ...x, schema: setArchivePermissionsSchema }))
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x) => new GetArchivePermissionsQueryHandler({ ...app }).handle({ ...x }))
}
