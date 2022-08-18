import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { XyoArchivePayloadFilterPredicate, XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

export type XyoBoundWitnessFilterPredicate = XyoPayloadFilterPredicate & Partial<XyoBoundWitness>

export type XyoArchiveBoundWitnessFilterPredicate = XyoArchivePayloadFilterPredicate & Partial<XyoBoundWitness>
