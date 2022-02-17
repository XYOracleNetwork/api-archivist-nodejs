import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

export interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads?: Record<string, unknown>[][]
}
