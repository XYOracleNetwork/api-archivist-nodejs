import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { ArchiveBoundWitnessesArchivist } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
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
  const block = (await archivist.get([{ archive, hash }])).pop()
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
