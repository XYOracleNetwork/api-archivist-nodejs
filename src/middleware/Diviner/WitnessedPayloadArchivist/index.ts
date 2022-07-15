import { WitnessedPayloadArchivist } from './WitnessedPayloadArchivist'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivistWitnessedPayloadArchivist: WitnessedPayloadArchivist
    }
  }
}

export * from './MongoDB'
export * from './WitnessedPayloadArchivist'
