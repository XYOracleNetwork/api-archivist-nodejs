import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadRepository'

export type BoundWitnessArchivist<TId = string, TQuery = unknown> = PayloadArchivist<XyoBoundWitness, TId, TQuery>
