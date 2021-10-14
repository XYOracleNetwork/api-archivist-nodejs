import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistPayloadMongoSdk, Result, trapServerError } from '../../../lib'

const sampleBoundWitness = async (archive: string, size: number) => {
  const bwSdk = getArchivistPayloadMongoSdk(archive)
  return await bwSdk.sample(size)
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  const size = parseInt(assertEx(event.pathParameters?.['size'], 'Missing size'))
  await trapServerError(callback, async () => {
    const payloads = await sampleBoundWitness(archive, size)
    return Result.Ok(callback, payloads)
  })
}
