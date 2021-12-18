import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivistPayloadMongoSdk } from '../../../lib'
import { prepareBoundWitnesses } from './prepareBoundWitnesses'
import { storeBoundWitnesses } from './storeBoundWitnesses'
import { validateBody } from './validateBody'

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads: Record<string, unknown>[][]
}

export const postArchiveBlock = async (req: Request, res: Response, next: NextFunction) => {
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
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: validationErrors[0].message })
  } else {
    let bwResult: number | undefined
    let payloadsResult: number | undefined
    if (body.boundWitnesses) {
      const { payloads, sanitized } = prepareBoundWitnesses(body.boundWitnesses, boundWitnessMetaData, payloadMetaData)

      bwResult = await storeBoundWitnesses(archive, sanitized)
      assertEx(
        bwResult === body.boundWitnesses.length,
        `Boundwitness Storage Failed [${bwResult}/${body.boundWitnesses.length}]`
      )

      if (payloads.length > 0) {
        const sdk = await getArchivistPayloadMongoSdk(archive)
        payloadsResult = await sdk.insertMany(assertEx(payloads))
        assertEx(payloadsResult === payloads.length, `Payload Storage Failed [${payloadsResult}/${payloads.length}]`)
      }
    }
    res.json({ boundWitnesses: bwResult, payloads: payloadsResult })
    next()
  }
}
