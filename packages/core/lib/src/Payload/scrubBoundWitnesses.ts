import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/boundwitness'

export const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields as XyoBoundWitness
  })
}
