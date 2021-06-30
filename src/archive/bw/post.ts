import 'source-map-support/register'

import { XyoBoundWitnessBuilder, XyoBoundWitnessJson, XyoBoundWitnessSchema } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import Ajv, { ErrorObject } from 'ajv'
import lambda from 'aws-lambda'
import dotenv from 'dotenv'
import pick from 'lodash/pick'

import {
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadForwardingMongoSdk,
  Result,
  trapServerError,
} from '../../lib'

const ajv = new Ajv()

interface XyoArchivistBoundWitnessBody {
  boundWitnesses: XyoBoundWitnessJson[]
  payloads?: Record<string, unknown>[][]
}

const validateBoundWitnessHash = (bw: XyoBoundWitnessJson): ValidationError[] => {
  const hashable = pick(bw, ['addresses', 'payload_hashes', 'payload_schemas', 'previous_hashes'])
  const calculatedHash = XyoBoundWitnessBuilder.hash(hashable)
  if (calculatedHash != bw._hash) {
    return [{ message: `Calc/Existing: ${calculatedHash}!=${bw._hash}`, name: 'Invalid Hash' }]
  }
  return []
}

interface ValidationError extends Error {
  ajv?: ErrorObject
}

const validateBody = (body: XyoArchivistBoundWitnessBody): ValidationError[] => {
  const validate = ajv.compile(XyoBoundWitnessSchema)
  const x = body.boundWitnesses.map((bw) => {
    if (validate(bw)) {
      return validateBoundWitnessHash(bw)
    } else {
      return (
        validate.errors?.map((ajv) => {
          const result: ValidationError = {
            ajv,
            message: `${ajv?.instancePath}-${ajv?.message}`,
            name: 'JSON Validation Error',
          }
          return result
        }) ?? []
      )
    }
  })

  return x.reduce((acc, value) => acc.concat(value), [])
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
      console.log(`Error: ${validationErrors[0].message}`)
      Result.BadRequest(callback, { message: validationErrors[0].message })
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
      return Result.Ok(callback, { boundWitnesses: bwResult, payloads: payloadsResult })
    }
  })
}
