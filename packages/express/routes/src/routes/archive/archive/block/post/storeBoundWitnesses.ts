import { getArchivistBoundWitnessesMongoSdk } from '@xyo-network/archivist-lib'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

export const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.insertMany(boundWitnesses)
}