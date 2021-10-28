import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistBoundWitnessesMongoSdk, Result, trapServerError } from '../../../lib'

const getCount = async (archive: string) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.fetchCount()
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  await trapServerError(callback, async () => {
    const count = await getCount(archive)
    return Result.Ok(callback, { count })
  })
}
