import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk } from '../../../../lib'
import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'

const maxLimit = 100

export type SortOrder = 'asc' | 'desc'

export interface GetArchiveBlocksQueryParams extends NoReqQuery {
  hash: string
  limit?: string
  orderBy?: SortOrder
}

// TODO: Move to SDK lib
const getBoundWitnesses = async (archive: string, hash: string, limit = maxLimit, orderBy: SortOrder = 'asc') => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  const sortOrder = orderBy === 'asc' ? 1 : -1
  return await (
    await sdk.useCollection((col) =>
      col
        .find({ _archive: 'testA', _hash: { $gte: hash } })
        .sort({ _hash: sortOrder })
        .limit(limit)
    )
  ).toArray()
}

// TODO: Move to shared lib since we use for single hash endpoint too
const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields
  })
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
  const { hash, limit, orderBy } = req.query
  if (!hash) {
    next({ message: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST })
  }
  const parsed = parseInt(limit || `${maxLimit}`, 10)
  const parsedLimit = isNaN(parsed) || parsed > maxLimit ? maxLimit : parsed
  const parsedOrderBy = orderBy?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'

  // Get boundWitnesses
  const boundWitnesses = (await getBoundWitnesses(archive.archive, hash, parsedLimit, parsedOrderBy)) ?? []
  const response = scrubBoundWitnesses(boundWitnesses)
  res.json(response)
  next()
}

export const getArchiveBlocks = asyncHandler(handler)
