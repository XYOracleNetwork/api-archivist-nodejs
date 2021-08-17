import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads?: Record<string, unknown>[][]
}

export default XyoArchivistBoundWitnessBody
