import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistBoundWitnessesMongoSdk } from '../../../lib'

export const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]): Promise<number> => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  const result = await sdk.insertMany(boundWitnesses)
  assertEx(result === boundWitnesses.length, `Boundwitness Storage Failed [${result}/${boundWitnesses.length}]`)
  return result
}
