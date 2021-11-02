import 'source-map-support/register'

import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import {
  getArchivistBoundWitnessesMongoSdk,
  getArchivistPayloadMongoSdk,
  Result,
  trapServerError,
} from '../../../../lib'

const getBoundWitness = async (archive: string, hash: string) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.findByHash(hash)
}

const getPayloads = async (archive: string, hashes: string[]) => {
  const bwSdk = getArchivistPayloadMongoSdk(archive)
  return await bwSdk.findByHashes(hashes)
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
    if (bw && bw.length > 0) {
      return Result.Ok(callback, await getPayloads(archive, bw[0].payload_hashes))
    } else {
      return Result.BadRequest(callback, { message: 'Block not found' })
    }
  })
}
