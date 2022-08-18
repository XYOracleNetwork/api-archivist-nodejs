import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { PayloadArchivist } from './PayloadArchivist'

export type BoundWitnessArchivist<TId = string> = PayloadArchivist<XyoBoundWitness, TId>
