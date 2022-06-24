import { ArchiveRepository } from './ArchiveRepository'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archiveRepository: ArchiveRepository
    }
  }
}

export * from './ArchiveRepository'
export * from './MongoDB'
