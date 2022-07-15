import { WitnessedPayloadArchivist } from './ArchivistWitnessedPayloadRepository'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivistWitnessedPayloadArchivist: WitnessedPayloadArchivist
    }
  }
}

export * from './ArchivistWitnessedPayloadRepository'
export * from './MongoDB'
