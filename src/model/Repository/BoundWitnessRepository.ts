import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadRepository } from './PayloadRepository'

export type BoundWitnessRepository<TId = string, TQueryResponse = unknown, TQuery = unknown> = PayloadRepository<XyoBoundWitness, TId, TQueryResponse, TQuery>
