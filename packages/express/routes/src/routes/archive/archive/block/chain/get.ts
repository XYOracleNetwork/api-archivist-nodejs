import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { ArchiveBoundWitnessesArchivist } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { RequestHandler } from 'express'

import { BlockChainPathParams } from './blockChainPathParams'

const getBlocks = async (
  archivist: ArchiveBoundWitnessesArchivist,
  archive: string,
  hash: string,
  address: string,
  blocks: XyoBoundWitness[],
  limit: number,
) => {
  const query: XyoArchivistGetQuery = {
    hashes: [hash],
    schema: XyoArchivistGetQuerySchema,
  }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const result = await archivist.query(bw, query)
  const block = result?.[1]?.[0] as XyoBoundWitness
  if (block) {
    const addressIndex = block.addresses.findIndex((value) => value === address)
    if (addressIndex !== -1) {
      blocks.push(block)
      const previousHash = block.previous_hashes[addressIndex]
      if (previousHash && limit > blocks.length) {
        await getBlocks(archivist, archive, previousHash, address, blocks, limit)
      }
    }
  }
}

const handler: RequestHandler<BlockChainPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, address, limit, hash } = req.params
  const { archiveBoundWitnessesArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const blocks: XyoBoundWitness[] = []
  await getBlocks(archivist, archive, hash, address, blocks, limitNumber)
  res.json(blocks)
}

export const getArchiveBlockChain = asyncHandler(handler)
