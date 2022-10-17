import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { AddressHistoryQueryPayload, AddressHistoryQuerySchema, ArchiveLocals } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoDivinerWrapper } from '@xyo-network/diviner'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { AddressPathParams } from '../../AddressPathParams'

const defaultLimit = 10
const maxLimit = 20
const schema = AddressHistoryQuerySchema

export interface GetAddressHistoryQueryParams extends NoReqQuery {
  limit?: string
  offset?: string
}

const handler: RequestHandler<AddressPathParams, XyoBoundWitness[], NoReqBody, GetAddressHistoryQueryParams, ArchiveLocals> = async (
  req,
  res,
  next,
) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, offset } = req.query
  const { address } = req.params
  const { addressHistoryDiviner } = req.app
  const limitNumber = tryParseInt(limit) ?? defaultLimit
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const query: AddressHistoryQueryPayload = { address, limit: limitNumber, schema }
  if (offset) {
    query.offset = offset
  }
  const boundWitness = ((await new XyoDivinerWrapper(addressHistoryDiviner).divine([query])) as (XyoBoundWitness | null)[]).filter(exists)
  if (boundWitness) {
    res.json(scrubBoundWitnesses(boundWitness))
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getAddressHistory = asyncHandler(handler)
