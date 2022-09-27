import { assertEx } from '@xylabs/assert'
import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { ArchiveLocals, ArchivePathParams, SortDirection, XyoArchiveBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchiveBlocksQueryParams extends NoReqQuery {
  limit?: string
  order?: SortDirection
  timestamp?: string
}

const handler: RequestHandler<
  ArchivePathParams,
  Pick<XyoBoundWitness, keyof XyoBoundWitness>[],
  NoReqBody,
  GetArchiveBlocksQueryParams,
  ArchiveLocals
> = async (req, res, next) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, order, timestamp } = req.query
  const { archiveBoundWitnessArchivistFactory } = req.app
  const limitNumber = tryParseInt(limit) ?? defaultLimit
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const timestampNumber = tryParseInt(timestamp)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const filter: XyoArchiveBoundWitnessFilterPredicate = {
    archive: archive.archive,
    limit: limitNumber,
    order: parsedOrder,
    timestamp: timestampNumber,
  }
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const archivist = archiveBoundWitnessArchivistFactory(archive.archive)
  const result = await archivist.query(bw, query)
  const boundWitness = result[1] as XyoBoundWitness[]
  if (boundWitness) {
    res.json(scrubBoundWitnesses(boundWitness))
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlocks = asyncHandler(handler)
