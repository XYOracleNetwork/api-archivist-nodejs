import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { Query } from './Query'

export type QueryConverter<T extends XyoPayload = XyoPayload, R extends Request = Request> = (x: T, req: R) => Query
