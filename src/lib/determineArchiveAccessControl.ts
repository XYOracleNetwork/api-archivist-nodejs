import { IArchiveRecord } from './sdk'

export const determineArchiveAcessControl = (record: IArchiveRecord) => {
  const { accessControl } = record
  return accessControl || false
}
