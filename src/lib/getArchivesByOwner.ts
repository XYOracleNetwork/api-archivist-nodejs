import { getArchiveMongoSdk } from './getArchiveMongoSdk'

export interface IArchive {
  archive: string
  user: string
  boundWitnessPrivate: boolean
  payloadPrivate: boolean
}

export const getArchivesByOwner = async (user: string): Promise<IArchive[]> => {
  const sdk = await getArchiveMongoSdk()
  const response = await sdk.findByUser(user)
  return response.map((record) => {
    const { archive, user } = record
    let { boundWitnessPrivate, payloadPrivate } = record
    boundWitnessPrivate = boundWitnessPrivate ? boundWitnessPrivate : false
    payloadPrivate = payloadPrivate ? payloadPrivate : false
    return { archive, boundWitnessPrivate, payloadPrivate, user }
  })
}
