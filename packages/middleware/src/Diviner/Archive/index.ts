import { ArchiveArchivist } from './ArchiveArchivist'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archiveArchivist: ArchiveArchivist
    }
  }
}

export * from './ArchiveArchivist'
export * from './MongoDB'
