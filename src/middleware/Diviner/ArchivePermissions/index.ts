import { ArchivePermissionsArchivist } from '../../../model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivePermissionsArchivist: ArchivePermissionsArchivist
    }
  }
}

export * from '../../../model'
export * from './MongoDB'
