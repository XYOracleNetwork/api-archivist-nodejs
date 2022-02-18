import { ArchiveResult } from './archiveResult'
import { getArchivistArchiveMongoSdk } from './dbSdk'
import { determineArchiveAccessControl } from './determineArchiveAccessControl'

export const getArchiveByName = async (name: string): Promise<ArchiveResult | null> => {
  const sdk = await getArchivistArchiveMongoSdk()
  const record = await sdk.findByArchive(name)
  if (!record) return null
  const { archive, user } = record
  const accessControl = determineArchiveAccessControl(record)
  return { accessControl, archive, user }
}
