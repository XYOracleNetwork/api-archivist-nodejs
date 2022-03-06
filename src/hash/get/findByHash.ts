import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from '../../lib'

export const findByHash = async (hash: string): Promise<XyoBoundWitness | XyoPayload | null> => {
  const payloads = await getArchivistPayloadMongoSdk('temp')
  const payload = await payloads.findOne({ _hash: hash })
  if (payload) return payload
  const boundWitnesses = await getArchivistBoundWitnessesMongoSdk('temp')
  const boundWitness = await boundWitnesses.findOne({ _hash: hash })
  if (boundWitness) return boundWitness
  return null
}
