import 'source-map-support/register'

import { XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'
import dotenv from 'dotenv'

import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk, Result, trapServerError } from '../../../lib'
import flattenArray from './flattenArray'
import validateBody from './validateBody'

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitness[]
  payloads?: Record<string, unknown>[][]
}

const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitness[]) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.insertMany(boundWitnesses)
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  const _source_ip = event.requestContext.identity.sourceIp ?? undefined
  const _user_agent = event.requestContext.identity.userAgent ?? undefined
  const _timestamp = Date.now()

  await trapServerError(callback, async () => {
    dotenv.config()
    const body = JSON.parse(assertEx(event?.body, 'Missing post body')) as XyoArchivistBoundWitnessBody
    body.boundWitnesses = body.boundWitnesses.map((bw) => {
      return { ...bw, _source_ip, _timestamp, _user_agent }
    })
    const validationErrors = validateBody(body)

    if (validationErrors.length > 0) {
      console.log(`Error: ${validationErrors[0].message}`)
      Result.BadRequest(callback, { message: validationErrors[0].message })
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
          return { ...payload, _archive: archive }
        })

        if (payloads.length > 0) {
          const payloadSdk = getArchivistPayloadMongoSdk()
          payloadsResult = await payloadSdk.insertMany(assertEx(payloads))
          assertEx(payloadsResult === payloads.length, `Payload Storage Failed [${payloadsResult}/${payloads.length}]`)
        }
      }
      return Result.Ok(callback, { boundWitnesses: bwResult, payloads: payloadsResult })
    }
  })
}
