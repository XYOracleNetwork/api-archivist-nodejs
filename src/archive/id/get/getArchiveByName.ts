import { getArchiveMongoSdk } from '../../../lib'

export const getArchiveByName = async (name: string) => {
  const sdk = await getArchiveMongoSdk()
  const record = await sdk.findByArchive(name)
  if (!record) return record
  const { archive, user } = record
  let { boundWitnessPrivate, payloadPrivate } = record
  boundWitnessPrivate = boundWitnessPrivate ? boundWitnessPrivate : false
  payloadPrivate = payloadPrivate ? payloadPrivate : false
  return { archive, boundWitnessPrivate, payloadPrivate, user }
}
