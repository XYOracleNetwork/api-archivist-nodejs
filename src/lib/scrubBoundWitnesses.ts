import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'

export const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields
  })
}
