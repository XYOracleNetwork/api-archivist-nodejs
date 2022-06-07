import { QueryProcessorRegistry } from './QueryProcessorRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      queryProcessors: QueryProcessorRegistry
    }
  }
}

export * from './QueryProcessor'
export * from './QueryProcessorRegistry'
export * from './SchemaToQueryProcessorRegistry'
