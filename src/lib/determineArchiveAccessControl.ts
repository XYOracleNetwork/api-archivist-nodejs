import { IArchiveRecord } from './archiveRecord'

export const determineArchiveAcessControl = (record: IArchiveRecord) => {
  const { accessControl } = record
  return accessControl || false
}
