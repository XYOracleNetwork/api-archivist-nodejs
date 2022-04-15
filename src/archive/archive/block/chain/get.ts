import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { WithId } from 'mongodb'

import { getArchivistBoundWitnessesMongoSdk } from '../../../../lib'
import { BlockChainPathParams } from './blockChainPathParams'

const getBlocks = async (archive: string, hash: string, address: string, blocks: WithId<XyoBoundWitness>[], limit: number) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  const block = (await sdk.findByHash(hash)).pop()
  if (block) {
    const addressIndex = block.addresses.findIndex((value) => value === address)
    if (addressIndex !== -1) {
      blocks.push(block)
      const previousHash = block.previous_hashes[addressIndex]
      if (previousHash && limit > blocks.length) {
        await getBlocks(archive, previousHash, address, blocks, limit)
      }
    }
  }
}

const handler: RequestHandler<BlockChainPathParams, XyoBoundWitness[]> = async (req, res, next) => {
  const { archive, address, limit, hash } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const blocks: WithId<XyoBoundWitness>[] = []
  await getBlocks(archive, hash, address, blocks, limitNumber)
  res.json(blocks)
  next()
}

export const getArchiveBlockChain = asyncHandler(handler)
