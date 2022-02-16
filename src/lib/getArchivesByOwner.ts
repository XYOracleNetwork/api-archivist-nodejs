import { getArchivistArchiveMongoSdk } from './dbSdk'
import { determineArchiveAcessControl } from './determineArchiveAccessControl'

export interface IArchiveResult {
  archive: string
  user: string
  accessControl: boolean
}

export const getArchivesByOwner = async (user: string): Promise<IArchiveResult[]> => {
  const sdk = await getArchivistArchiveMongoSdk()
  const response = await sdk.findByUser(user)
  return response.map((record) => {
    const { archive, user } = record
    const accessControl = determineArchiveAcessControl(record)
    return { accessControl, archive, user }
  })
}
