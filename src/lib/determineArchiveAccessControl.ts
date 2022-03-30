import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

export const determineArchiveAccessControl = (record: XyoArchive) => {
  const { accessControl } = record
  return accessControl || false
}
