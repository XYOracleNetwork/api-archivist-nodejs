import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'

export const removePayloads = (boundWitnesses: XyoBoundWitnessWithMeta[]): XyoBoundWitnessWithMeta[] => {
  return boundWitnesses.map((boundWitness) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _payloads, ...sanitized } = boundWitness
    return { ...sanitized }
  })
}
