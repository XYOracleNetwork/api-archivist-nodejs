import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { v4 } from 'uuid'

export const generateArchiveKey = (archive: string): XyoArchiveKey => {
  const key = v4()
  return { archive, key }
}
