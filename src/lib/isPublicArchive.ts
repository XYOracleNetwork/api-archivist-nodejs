import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

export const isPublicArchive = (archive?: XyoArchive | null): boolean => {
  return !archive ? false : !archive.accessControl
}
