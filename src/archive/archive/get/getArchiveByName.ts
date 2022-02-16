import { determineArchiveAcessControl, getArchivistArchiveMongoSdk } from '../../../lib'

export const getArchiveByName = async (name: string) => {
  const sdk = await getArchivistArchiveMongoSdk()
  const record = await sdk.findByArchive(name)
  if (!record) return record
  const { archive, user } = record
  const accessControl = determineArchiveAcessControl(record)
  return { accessControl, archive, user }
}
