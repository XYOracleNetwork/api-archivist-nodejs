import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ArchivePathParams } from '../../../../model'
import { prepareBoundWitnesses } from './prepareBoundWitnesses'
import { storeBoundWitnesses } from './storeBoundWitnesses'
import { storePayloads } from './storePayloads'
import { validateBody } from './validateBody'

const handler: RequestHandler<ArchivePathParams, XyoBoundWitness[], XyoBoundWitness[]> = async (req, res, next) => {
  const { archive } = req.params
  const _source_ip = req.ip ?? undefined
  const _user_agent = req.headers['User-agent'] ?? undefined
  const _timestamp = Date.now()

  //fairly complex logic to handle old object, or new single/array boundwitness
  const body: XyoBoundWitness[] = (Array.isArray(req.body) ? req.body : [req.body]) as XyoBoundWitness[]

  const boundWitnessMetaData = { _source_ip, _timestamp, _user_agent }
  const payloadMetaData = { _archive: archive }

  /*const validationErrors = validateBody(body)

  if (validationErrors.length > 0) {
    console.log(`Error: ${validationErrors[0].message}`)
    next({ message: validationErrors[0].message, statusCode: StatusCodes.BAD_REQUEST })
    return
  }*/

  const { payloads, sanitized } = prepareBoundWitnesses(body, boundWitnessMetaData, payloadMetaData)

  await storeBoundWitnesses(archive, sanitized)
  payloads.length ? await storePayloads(archive, payloads) : { insertedCount: 0 }
  res.json(sanitized)

  next()
}

export const postArchiveBlock = asyncHandler(handler)
