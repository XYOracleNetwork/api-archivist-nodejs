import { getArchiveOwnerMongoSdk } from '../../lib'

export const getArchivesByOwner = async (user: string): Promise<string[]> => {
  const sdk = await getArchiveOwnerMongoSdk()
  const result = await sdk.findByUser(user)
  return result.map((archive) => archive._id)
}
