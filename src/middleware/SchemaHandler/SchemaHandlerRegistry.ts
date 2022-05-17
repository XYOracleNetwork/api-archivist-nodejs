import { SchemaHandler } from './SchemaHandler'

export interface SchemaHandlerRegistry {
  handlers: Record<string, SchemaHandler>
  registerHandler: (schema: string, handler: SchemaHandler) => void
}
