import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistPayloadMongoSdk, Result, trapServerError } from '../../../lib'

const getPayload = async (archive: string, hash: string) => {
  const bwSdk = getArchivistPayloadMongoSdk(archive)
  return await bwSdk.findByHash(hash)
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  const hash = assertEx(event.pathParameters?.['hash'], 'Missing hash')
  await trapServerError(callback, async () => {
    return Result.Ok(callback, (await getPayload(archive, hash)) ?? [])
  })
}
