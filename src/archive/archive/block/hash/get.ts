import 'source-map-support/register'

import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { genericAsyncHandler, getArchivistBoundWitnessesMongoSdk } from '../../../../lib'
import { BlockHashPathParams } from './blockHashPathParams'

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

export type GetArchiveBlockHashResponse = {
  _archive?: string
  _hash?: string
  _timestamp?: number
  _user_agent?: string | null
}[]

const handler: RequestHandler<BlockHashPathParams, GetArchiveBlockHashResponse> = async (req, res, next) => {
  const { archive, hash } = req.params
  res.json(scrubBoundWitnesses(await getBoundWitness(archive, hash)) ?? [])
  next()
}

export const getArchiveBlockHash = genericAsyncHandler(handler)
