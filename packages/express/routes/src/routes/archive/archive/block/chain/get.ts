import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { ArchiveBoundWitnessArchivist } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { PayloadWrapper } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { BlockChainPathParams } from './blockChainPathParams'

const getBlocks = async (archivist: ArchiveBoundWitnessArchivist, hash: string, address: string, blocks: XyoBoundWitness[], limit: number) => {
  const query: XyoArchivistGetQuery = {
    hashes: [hash],
    schema: XyoArchivistGetQuerySchema,
  }
  const bw = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(query)).payload(query).build()
  const result = await archivist.query(bw, [query])
  const block = result?.[1]?.[0] as XyoBoundWitness
  if (block) {
    const addressIndex = block.addresses.findIndex((value) => value === address)
    if (addressIndex !== -1) {
      blocks.push(block)
      const previousHash = block.previous_hashes[addressIndex]
      if (previousHash && limit > blocks.length) {
        await getBlocks(archivist, previousHash, address, blocks, limit)
      }
    }
  }
}

const handler: RequestHandler<BlockChainPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, address, limit, hash } = req.params
  const { archiveBoundWitnessArchivistFactory } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const blocks: XyoBoundWitness[] = []
  await getBlocks(archiveBoundWitnessArchivistFactory(archive), hash, address, blocks, limitNumber)
  res.json(blocks)
}

export const getArchiveBlockChain = asyncHandler(handler)
