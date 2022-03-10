import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import {
  getArchivistAllBoundWitnessesMongoSdk,
  getArchivistAllPayloadMongoSdk,
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadMongoSdk,
} from './dbSdk'

export const findOnePayloadByHash = async (hash: string, archive?: string): Promise<XyoPayload | null> => {
  const sdk = archive ? await getArchivistPayloadMongoSdk(archive) : await getArchivistAllPayloadMongoSdk()
  return sdk.findOne({ _hash: hash })
}

export const findOneBoundWitnessByHash = async (hash: string, archive?: string): Promise<XyoBoundWitness | null> => {
  const sdk = archive
    ? await getArchivistBoundWitnessesMongoSdk(archive)
    : await getArchivistAllBoundWitnessesMongoSdk()
  return sdk.findOne({ _hash: hash })
}

export const findOneByHash = async (hash: string, archive?: string): Promise<XyoBoundWitness | XyoPayload | null> => {
  const payload = await findOnePayloadByHash(hash, archive)
  return payload ? payload : findOneBoundWitnessByHash(hash, archive)
}
