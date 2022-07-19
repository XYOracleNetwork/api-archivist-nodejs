import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk, getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from '../dbSdk'

export const findOnePayloadByHash = (hash: string, archive?: string): Promise<XyoPayload | null> => {
  const sdk = archive ? getArchivistPayloadMongoSdk(archive) : getArchivistAllPayloadMongoSdk()
  return sdk.findOne({ _hash: hash })
}

export const findOneBoundWitnessByHash = (hash: string, archive?: string): Promise<XyoBoundWitness | null> => {
  const sdk = archive ? getArchivistBoundWitnessesMongoSdk(archive) : getArchivistAllBoundWitnessesMongoSdk()
  return sdk.findOne({ _hash: hash })
}

export const findOneByHash = async (hash: string, archive?: string): Promise<XyoBoundWitness | XyoPayload | null> => {
  const payload = await findOnePayloadByHash(hash, archive)
  return payload ? payload : findOneBoundWitnessByHash(hash, archive)
}

export const findPayloadsByHash = async (hash: string, archive?: string): Promise<XyoPayload[]> => {
  const sdk = archive ? getArchivistPayloadMongoSdk(archive) : getArchivistAllPayloadMongoSdk()
  return (await sdk.find({ _hash: hash })).limit(100).toArray()
}

export const findBoundWitnessesByHash = async (hash: string, archive?: string) => {
  const sdk = archive ? getArchivistBoundWitnessesMongoSdk(archive) : getArchivistAllBoundWitnessesMongoSdk()
  return (await sdk.find({ _hash: hash })).limit(100).toArray()
}

export const findByHash = async (hash: string, archive?: string): Promise<XyoPayload[]> => {
  const payloads = await findPayloadsByHash(hash, archive)
  return payloads.length ? payloads : findBoundWitnessesByHash(hash, archive)
}
