import { QueryProcessorRegistry } from './QueryProcessorRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      payloadProcessorRegistry: QueryProcessorRegistry
    }
  }
}

export * from './QueryProcessor'
export * from './QueryProcessorRegistry'
export * from './SchemaToQueryProcessorRegistry'
