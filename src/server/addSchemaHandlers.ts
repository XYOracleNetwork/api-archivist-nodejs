import { Application } from 'express'

import { GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, SetArchivePermissionsCommandHandler } from '../Handlers'
import { XyoPayloadProcessorRegistry } from '../middleware'
import {
  GetArchivePermissionsPayload,
  getArchivePermissionsSchema,
  GetDomainConfigPayload,
  getDomainConfigSchema,
  SetArchivePermissionsPayload,
  setArchivePermissionsSchema,
} from '../model'

export const addSchemaHandlers = (app: Application) => {
  const registry: XyoPayloadProcessorRegistry = app.payloadProcessorRegistry
  registry.registerProcessorForSchema('network.xyo.debug', () => Promise.resolve())
  registry.registerProcessorForSchema('network.xyo.test', () => Promise.resolve())
  registry.registerProcessorForSchema(setArchivePermissionsSchema, (x: SetArchivePermissionsPayload) => new SetArchivePermissionsCommandHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getArchivePermissionsSchema, (x: GetArchivePermissionsPayload) => new GetArchivePermissionsQueryHandler({ ...app }).handle(x))
  registry.registerProcessorForSchema(getDomainConfigSchema, (x: GetDomainConfigPayload) => new GetDomainConfigQueryHandler({ ...app }).handle(x))
}
