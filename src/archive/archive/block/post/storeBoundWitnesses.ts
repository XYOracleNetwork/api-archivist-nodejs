import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistBoundWitnessesMongoSdk } from '../../../../lib'

export const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.insertMany(boundWitnesses)
}
