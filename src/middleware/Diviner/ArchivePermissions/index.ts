import { ArchivePermissionsRepository } from './ArchivePermissionsRepository'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivePermissionsRepository: ArchivePermissionsRepository
    }
  }
}

export * from './ArchivePermissionsRepository'
export * from './MongoDB'
