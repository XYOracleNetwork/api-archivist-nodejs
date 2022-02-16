import { IArchiveRecord } from './dbSdk'

export const determineArchiveAcessControl = (record: IArchiveRecord) => {
  const { accessControl } = record
  return accessControl || false
}
