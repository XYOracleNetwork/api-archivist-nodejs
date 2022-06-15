import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

/**
 * Determines if there's access controls on an archive
 * @param record The archive record
 * @returns True if there's access controls, false otherwise
 */
export const determineArchiveAccessControl = (record: XyoArchive): boolean => {
  const { accessControl } = record
  let controls = false
  if (accessControl === true) {
    controls = true
  } else if (accessControl === false) {
    controls = false
  } else {
    controls = !!accessControl?.access
  }
  return controls
}
