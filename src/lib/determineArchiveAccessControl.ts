import { ArchiveRecord } from './archiveRecord'

export const determineArchiveAccessControl = (record: ArchiveRecord) => {
  const { accessControl } = record
  return accessControl || false
}
