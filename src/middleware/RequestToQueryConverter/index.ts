import { QueryConverterRegistry } from './QueryConverterRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      queryConverters: QueryConverterRegistry
    }
  }
}

export * from './QueryConverter'
export * from './QueryConverterRegistry'
export * from './XyoPayloadToQueryConverterRegistry'
