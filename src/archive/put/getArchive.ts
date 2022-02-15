import { getArchiveMongoSdk } from '../../lib'

export const getArchive = async (archive: string) => {
  const sdk = await getArchiveMongoSdk()
  await sdk.findByArchive(archive)
}
