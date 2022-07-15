import { ArchiveArchivist } from './ArchiveRepository'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archiveArchivist: ArchiveArchivist
    }
  }
}

export * from './ArchiveRepository'
export * from './MongoDB'
