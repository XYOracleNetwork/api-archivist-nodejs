import { XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'

import flattenArray from './flattenArray'
import XyoArchivistBoundWitnessBody from './XyoArchivistBoundWitnessBody'

const validateBody = (body: XyoArchivistBoundWitnessBody): Error[] => {
  if (Array.isArray(body.boundWitnesses)) {
    const errors = body.boundWitnesses.map((bw) => {
      const wrapper = new XyoBoundWitnessWrapper(bw)
      return wrapper.validator.all()
    })
    return flattenArray(errors)
  } else {
    return [Error('boundWitnesses must be array')]
  }
}

export default validateBody
