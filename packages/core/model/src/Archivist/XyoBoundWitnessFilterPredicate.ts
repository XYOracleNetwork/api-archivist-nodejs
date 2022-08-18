import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { XyoArchivePayloadFilterPredicate, XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type XyoBoundWitnessFilterPredicate = Omit<XyoPayloadFilterPredicate, 'schema'> & Partial<XyoBoundWitness>

export type XyoArchiveBoundWitnessFilterPredicate = Omit<XyoArchivePayloadFilterPredicate, 'schema'> & Partial<XyoBoundWitness>
