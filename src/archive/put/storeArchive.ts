import { getArchiveMongoSdk } from '../../lib'

export interface IStoreArchive {
  archive: string
  user: string
  boundWitnessPrivate: boolean
  payloadPrivate: boolean
}

export const storeArchive = async (request: IStoreArchive): Promise<IStoreArchive | null> => {
  const sdk = await getArchiveMongoSdk()
  try {
    await sdk.insert(request)
  } catch (_error) {
    // NOTE: Possibly generated a duplicate key error if archive is already owned
    // but at this point we don't know if the owner is already the desired owner
    // from the insert above
  }
  const result = await sdk.findByArchive(request.archive)
  return result ? { ...result } : null
}
