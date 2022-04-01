import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'

import { flattenArray } from './flattenArray'

export const validateBody = (body: XyoBoundWitness[]): Error[] => {
  if (Array.isArray(body)) {
    const errors = body.map((bw) => {
      const wrapper = new XyoBoundWitnessWrapper(bw)
      return wrapper.validator.all()
    })
    return flattenArray(errors)
  } else {
    return [Error('boundWitnesses must be array')]
  }
}
