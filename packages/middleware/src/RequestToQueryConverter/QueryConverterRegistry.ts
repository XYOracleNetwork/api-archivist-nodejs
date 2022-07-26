import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { QueryConverter } from './QueryConverter'

export interface QueryConverterRegistry {
  converters: Readonly<Record<string, QueryConverter>>
  registerConverterForSchema: <T extends XyoPayloadWithMeta = XyoPayloadWithMeta, R extends Request = Request>(schema: string, processor: QueryConverter<T, R>) => void
}
