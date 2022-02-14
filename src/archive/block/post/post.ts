import 'source-map-support/register'

import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { InsertManyResult } from 'mongodb'

import { prepareBoundWitnesses } from './prepareBoundWitnesses'
import { storeBoundWitnesses } from './storeBoundWitnesses'
import { storePayloads } from './storePayloads'
import { validateBody } from './validateBody'

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads: Record<string, unknown>[][]
}

export interface IPostArchiveBlockResponse {
  boundWitnesses: InsertManyResult<XyoBoundWitness>
  payloads: InsertManyResult<XyoPayload>
}

export const postArchiveBlock = async (req: Request, res: Response<IPostArchiveBlockResponse>, next: NextFunction) => {
  const { archive } = req.params
  const _source_ip = req.ip ?? undefined
  const _user_agent = req.headers['user-agent'] ?? undefined
  const _timestamp = Date.now()

  const body = req.body as XyoArchivistBoundWitnessBody

  const boundWitnessMetaData = { _source_ip, _timestamp, _user_agent }
  const payloadMetaData = { _archive: archive }

  const validationErrors = validateBody(body)

  if (validationErrors.length > 0) {
    console.log(`Error: ${validationErrors[0].message}`)
    next({ message: validationErrors[0].message, statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const { payloads, sanitized } = prepareBoundWitnesses(body.boundWitnesses, boundWitnessMetaData, payloadMetaData)

  const bwResult = await storeBoundWitnesses(archive, sanitized)
  const payloadsResult = await storePayloads(archive, payloads)
  res.json({ boundWitnesses: bwResult, payloads: payloadsResult })

  next()
}
