import { NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk } from '../../../../lib'
import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'

// TODO: Move to SDK lib
const getBoundWitnesses = async (archive: string, hash: string, limit = 100, orderBy: 'asc' | 'desc' = 'asc') => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  const sortOrder = orderBy === 'asc' ? 1 : -1
  return await (
    await sdk.useCollection((collection) => collection.find().sort({ _id: sortOrder }).limit(limit))
  ).toArray()
}

// TODO: Move to shared lib since we use for single hash endpoint too
const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields
  })
}

interface GetArchiveBlocksQueryParams extends NoReqQuery {
  hash: string
  limit?: string
  orderBy?: 'asc' | 'desc'
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
  const parsed = parseInt(limit || '100', 10)
  const parsedLimit = isNaN(parsed) || parsed > 100 ? 100 : parsed
  const parsedOrderBy = orderBy === 'asc' ? 'asc' : 'desc'

  // Get boundWitnesses
  const boundWitnesses = (await getBoundWitnesses(archive.archive, hash, parsedLimit, parsedOrderBy)) ?? []
  const response = scrubBoundWitnesses(boundWitnesses)
  res.json(response)
  next()
}

export const getArchiveBlocks = handler
