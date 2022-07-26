import { ArchivePermissionsArchivist } from '@xyo-network/archivist-model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivePermissionsArchivist: ArchivePermissionsArchivist
    }
  }
}

export * from './MongoDB'
export * from '@xyo-network/archivist-model'
