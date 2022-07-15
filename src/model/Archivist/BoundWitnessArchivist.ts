import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'

export type BoundWitnessArchivist<TId = string, TQuery = unknown> = PayloadArchivist<XyoBoundWitness, TId, TQuery>
