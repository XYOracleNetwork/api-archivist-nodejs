import { ArchiveResult } from '../model'

export const isPublicArchive = (archive?: ArchiveResult | null): boolean => {
  return !archive ? false : !archive.accessControl
}
