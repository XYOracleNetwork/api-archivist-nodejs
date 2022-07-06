import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'

export const scrubBoundWitnesses = <T extends object>(boundWitnesses: XyoBoundWitness<T>[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields as XyoBoundWitness<T>
  })
}
