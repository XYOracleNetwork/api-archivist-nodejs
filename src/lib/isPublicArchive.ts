import { ArchiveResult } from './archiveResult'

export const isPublicArchive = (archive?: ArchiveResult | null): boolean => {
  return !archive ? false : !archive.accessControl
}
