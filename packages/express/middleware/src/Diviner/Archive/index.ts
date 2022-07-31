import { ArchiveArchivist } from '@xyo-network/archivist-model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archiveArchivist: ArchiveArchivist
    }
  }
}

export * from './MongoDB'
