import 'source-map-support/register'

import { NextFunction, Request, Response } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../lib'

const getPayload = async (archive: string, hash: string) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.findByHash(hash)
}

export const getArchivePayloadHash = async (req: Request, res: Response, next: NextFunction) => {
  const { archive, hash } = req.params

  res.json((await getPayload(archive, hash)) ?? [])
  next()
}
