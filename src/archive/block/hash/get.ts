import 'source-map-support/register'

import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'
import { NextFunction, Request, Response } from 'express'

import { getArchivistBoundWitnessesMongoSdk } from '../../../lib'

const getBoundWitness = async (archive: string, hash: string) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbedFields
  })
}

export interface IGetArchiveBlockHashResponse {
  _archive?: string
  _hash?: string
  _timestamp?: number
  _user_agent?: string | null
}

export const getArchiveBlockHash = async (
  req: Request,
  res: Response<IGetArchiveBlockHashResponse[]>,
  next: NextFunction
) => {
  const { archive, hash } = req.params
  res.json(scrubBoundWitnesses(await getBoundWitness(archive, hash)) ?? [])
  next()
}
