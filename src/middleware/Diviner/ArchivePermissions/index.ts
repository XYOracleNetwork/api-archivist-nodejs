import { ArchivePermissionsRepository } from '../../../model'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      archivePermissionsRepository: ArchivePermissionsRepository
    }
  }
}

export * from '../../../model'
export * from './MongoDB'
