import 'source-map-support/register'

import { XyoBoundWitnessJson, XyoBoundWitnessSchema } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import Ajv, { ErrorObject } from 'ajv'
import lambda from 'aws-lambda'
import dotenv from 'dotenv'

import {
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadForwardingMongoSdk,
  Result,
  trapServerError,
} from '../../lib'

const ajv = new Ajv()

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitnessJson[]
  payloads?: Record<string, any>[][]
}

const validateBody = (body: XyoArchivistBoundWitnessBody): ErrorObject[] => {
  const validate = ajv.compile(XyoBoundWitnessSchema)
  if (validate(body)) {
    return []
  } else {
    return validate.errors ?? []
  }
}

const storeBoundWitnesses = async (archive: string, boundWitnesses: XyoBoundWitnessJson[]) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.insertMany(boundWitnesses)
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')

  await trapServerError(callback, async () => {
    dotenv.config()
    const body = JSON.parse(assertEx(event?.body, 'Missing post body')) as XyoArchivistBoundWitnessBody
    const validationErrors = validateBody(body)

    if (validationErrors.length > 0) {
      Result.BadRequest(callback, new Error(validationErrors[0].message))
    } else {
      let bwResult: number | undefined
      let payloadsResult: number | undefined
      if (body.boundWitnesses) {
        bwResult = await storeBoundWitnesses(archive, body.boundWitnesses)
        assertEx(
          bwResult === body.boundWitnesses.length,
          `Boundwitness Storage Failed [${bwResult}/${body.boundWitnesses.length}]`
        )
      }
      if (body.payloads) {
        const payloadSdk = getArchivistPayloadForwardingMongoSdk()
        payloadsResult = await payloadSdk.insertMany(assertEx(body.payloads))
        assertEx(
          payloadsResult === body.payloads.length,
          `Payload Storage Failed [${payloadsResult}/${body.payloads.length}]`
        )
      }
      return Result.Ok(callback, { bw: bwResult, payloads: payloadsResult })
    }
  })
}
