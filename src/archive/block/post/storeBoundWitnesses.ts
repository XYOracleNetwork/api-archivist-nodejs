import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistBoundWitnessesMongoSdk } from '../../../lib'

const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.insertMany(boundWitnesses)
}

export default storeBoundWitnesses
