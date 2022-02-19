import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SortOrder } from '../../../../../model'
import { getArchivistBoundWitnessesMongoSdk, scrubBoundWitnesses } from '../../../../lib'
import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchiveBlocksQueryParams extends NoReqQuery {
  hash: string
  limit?: string
  order?: SortOrder
}

// TODO: Move to SDK lib
const getBoundWitnesses = async (archive: string, hash: string, limit = defaultLimit, orderBy: SortOrder = 'asc') => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  const sortOrder = orderBy === 'asc' ? 1 : -1
  return await (
    await sdk.useCollection((col) =>
      col
        .find({ _archive: archive, _hash: { $gt: hash } })
        .sort({ _hash: sortOrder })
        .limit(limit)
    )
  ).toArray()
}

const handler: RequestHandler<
  ArchivePathParams,
  Pick<XyoBoundWitness, string>[],
  NoReqBody,
  GetArchiveBlocksQueryParams,
  ArchiveLocals
> = async (req, res, next) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  // Validate path params
  const { hash, limit, order: orderBy } = req.query
  if (!hash) {
    next({ message: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST })
  }
  const limitNumber = tryParseInt(limit) ?? 10
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrderBy = orderBy?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'

  // Get boundWitnesses
  const boundWitnesses = (await getBoundWitnesses(archive.archive, hash, limitNumber, parsedOrderBy)) ?? []
  const response = scrubBoundWitnesses(boundWitnesses)
  res.json(response)
  next()
}

export const getArchiveBlocks = asyncHandler(handler)
