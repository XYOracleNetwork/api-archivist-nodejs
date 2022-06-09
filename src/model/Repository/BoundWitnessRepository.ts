import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export type BoundWitnessRepository<TId = string, TQuery = unknown> = PayloadRepository<XyoBoundWitness, TId, TQuery>
