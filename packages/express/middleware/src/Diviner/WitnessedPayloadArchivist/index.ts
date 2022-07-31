import { WitnessedPayloadArchivist } from '@xyo-network/archivist-model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivistWitnessedPayloadArchivist: WitnessedPayloadArchivist
    }
  }
}

export * from './MongoDB'
