import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from './dbSdk'

export const findByHash = async (hash: string, archive = 'temp'): Promise<XyoBoundWitness | XyoPayload | null> => {
  const payloads = await getArchivistPayloadMongoSdk(archive)
  const payload = await payloads.findOne({ _hash: hash })
  if (payload) return payload
  const boundWitnesses = await getArchivistBoundWitnessesMongoSdk(archive)
  const boundWitness = await boundWitnesses.findOne({ _hash: hash })
  if (boundWitness) return boundWitness
  return null
}
