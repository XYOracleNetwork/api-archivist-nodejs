import { RequestToQueryConverterRegistry } from './RequestToQueryConverterRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      requestToQueryConverterRegistry: RequestToQueryConverterRegistry
    }
  }
}

export * from './RequestToQueryConverter'
export * from './RequestToQueryConverterRegistry'
export * from './XyoPayloadToQueryConverterRegistry'
