import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { RequestToQueryConverter } from './RequestToQueryConverter'

export interface RequestToQueryConverterRegistry {
  converters: Readonly<Record<string, RequestToQueryConverter>>
  registerConverterForSchema: <T extends XyoPayload = XyoPayload, R extends Request = Request>(schema: string, processor: RequestToQueryConverter<T, R>) => void
}
