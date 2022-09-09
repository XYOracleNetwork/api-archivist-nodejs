import { XyoBoundWitness } from '@xyo-network/boundwitness'

import { XyoArchivePayloadFilterPredicate, XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

type WithoutSchema<T> = Omit<Omit<T, 'schema'>, 'schemas'>

// TODO: Should we just accept "schema"/"schemas" here and infer that they mean "payload_schemas"?
export type XyoBoundWitnessFilterPredicate = WithoutSchema<XyoPayloadFilterPredicate> & Partial<XyoBoundWitness>

export type XyoArchiveBoundWitnessFilterPredicate = WithoutSchema<XyoArchivePayloadFilterPredicate> & Partial<XyoBoundWitness>
