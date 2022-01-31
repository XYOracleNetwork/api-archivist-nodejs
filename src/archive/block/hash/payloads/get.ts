import 'source-map-support/register'

import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from '../../../../lib'

const getBoundWitness = async (archive: string, hash: string) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const getPayloads = async (archive: string, hashes: string[]) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.findByHashes(hashes)
}

export const getArchiveBlockHashPayloads = async (req: Request, res: Response, next: NextFunction) => {
  const { archive, hash } = req.params
  const bw = await getBoundWitness(archive, hash)
  if (bw && bw.length > 0) {
    res.json(await getPayloads(archive, bw[0].payload_hashes))
    next()
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}
