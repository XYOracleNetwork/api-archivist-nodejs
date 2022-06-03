import { ArchivistWitnessedPayloadRepository } from './ArchivistWitnessedPayloadRepository'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivistWitnessedPayloadRepository: ArchivistWitnessedPayloadRepository
    }
  }
}

export * from './ArchivistWitnessedPayloadRepository'
export * from './MongoDB'
