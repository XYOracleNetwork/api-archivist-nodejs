import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistBoundWitnessesMongoSdk, Result, trapServerError } from '../../lib'

const getBoundWitness = async (archive: string, hash: string) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
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
    const bw = await getBoundWitness(archive, hash)
    return Result.Ok(callback, bw)
  })
}
