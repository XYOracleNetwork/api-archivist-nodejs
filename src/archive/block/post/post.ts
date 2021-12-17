import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from '../../../lib'
import flattenArray from './flattenArray'
import validateBody from './validateBody'

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads?: Record<string, unknown>[][]
}

const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.insertMany(boundWitnesses)
}

export const postArchiveBlock = async (req: Request, res: Response, next: NextFunction) => {
  const { archive } = req.params
  const _source_ip = req.ip ?? undefined
  const _user_agent = req.headers['user-agent'] ?? undefined
  const _timestamp = Date.now()

  const body = req.body as XyoArchivistBoundWitnessBody
  body.boundWitnesses = body.boundWitnesses.map((bw) => {
    return { ...bw, _source_ip, _timestamp, _user_agent }
  })
  const validationErrors = validateBody(body)

  if (validationErrors.length > 0) {
    console.log(`Error: ${validationErrors[0].message}`)
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: validationErrors[0].message })
  } else {
    let bwResult: number | undefined
    let payloadsResult: number | undefined
    if (body.boundWitnesses) {
      const payloadLists: XyoPayload[][] = []
      const sanitizedBoundWitnesses = body.boundWitnesses.map((boundWitness) => {
        const { _payloads, ...sanitized } = boundWitness
        payloadLists.push(_payloads ?? [])
        return sanitized
      })
      bwResult = await storeBoundWitnesses(archive, sanitizedBoundWitnesses)
      assertEx(
        bwResult === body.boundWitnesses.length,
        `Boundwitness Storage Failed [${bwResult}/${body.boundWitnesses.length}]`
      )

      const payloads = flattenArray(payloadLists).map((payload) => {
        const wrapper = new XyoPayloadWrapper(payload)
        return { ...payload, _archive: archive, _hash: wrapper.sortedHash() }
      })

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
