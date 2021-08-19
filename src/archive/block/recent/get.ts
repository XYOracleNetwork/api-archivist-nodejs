import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistBoundWitnessesMongoSdk, Result, trapServerError } from '../../../lib'

const getBoundWitness = async (archive: string, limit: number) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.findRecent(limit)
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  const limit = parseInt(assertEx(event.pathParameters?.['limit'], 'Missing limit'))
  assertEx(limit > 0 && limit <= 100, 'limit must be between 1 and 100')
  await trapServerError(callback, async () => {
    const bw = await getBoundWitness(archive, limit)
    return Result.Ok(
      callback,
      bw?.map(({ _payloads, ...clean }) => clean)
    )
  })
}
