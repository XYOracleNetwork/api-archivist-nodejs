import { determineArchiveAccessControl } from '../determineArchiveAccessControl'
import { getArchivistArchiveMongoSdk } from './getArchivistArchiveMongoSdk'

export interface StoreArchiveResult {
  archive: string
  user: string
  accessControl: boolean
}

export const storeArchive = async (request: StoreArchiveResult): Promise<StoreArchiveResult | null> => {
  const sdk = await getArchivistArchiveMongoSdk()
  try {
    await sdk.insert(request)
  } catch (_error) {
    // NOTE: Possibly generated a duplicate key error if archive is already owned
    // but at this point we don't know if the owner is already the desired owner
    // from the insert above
  }
  const record = await sdk.findByArchive(request.archive)
  if (!record) return record
  const { archive, user } = record
  const accessControl = determineArchiveAccessControl(record)
  return { accessControl, archive, user }
}
