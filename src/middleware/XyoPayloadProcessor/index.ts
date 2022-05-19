import { XyoPayloadProcessorRegistry } from './XyoPayloadProcessorRegistry'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // NOTE: Ideally we'd just override Application.locals with a strongly typed
    // version of our known locals but:
    // • Neither Express nor Express Serve Static Core expose Application as generic in a way that we can specify the type globally
    // • TypeScript doesn't support property overrides when merging declarations (which makes sense)
    // So the only thing we can do is add new properties to the interface, not override/narrow the type
    // of existing ones
    interface Application {
      payloadProcessorRegistry: XyoPayloadProcessorRegistry
    }
  }
}

export * from './XyoPayloadProcessor'
export * from './XyoPayloadProcessorRegistry'
export * from './XyoSchemaToPayloadProcessorRegistry'
