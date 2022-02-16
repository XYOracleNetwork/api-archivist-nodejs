import { getArchiveMongoSdk } from './getArchiveMongoSdk'

export interface IArchive {
  archive: string
  user: string
  boundWitnessPrivate: boolean
  payloadPrivate: boolean
}

export const getArchivesByOwner = async (user: string): Promise<IArchive[]> => {
  const sdk = await getArchiveMongoSdk()
  return sdk.findByUser(user)
}
