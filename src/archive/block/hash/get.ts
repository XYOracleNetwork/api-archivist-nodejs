import 'source-map-support/register'

import { XyoBoundWitness, XyoBoundWitnessWrapper } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import { getArchivistBoundWitnessesMongoSdk, Result, trapServerError } from '../../../lib'

const getBoundWitness = async (archive: string, hash: string) => {
  const bwSdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await bwSdk.findByHash(hash)
}

const scrubBoundWitnesses = (boundWitnesses: XyoBoundWitness[]) => {
  return boundWitnesses?.map((boundWitness) => {
    const bwWrapper = new XyoBoundWitnessWrapper(boundWitness)
    return bwWrapper.scrubbed
  })
}

export const entryPoint = async (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const archive = assertEx(event.pathParameters?.['archive'], 'Missing archive name')
  const hash = assertEx(event.pathParameters?.['hash'], 'Missing hash')
  await trapServerError(callback, async () => {
    return Result.Ok(callback, scrubBoundWitnesses((await getBoundWitness(archive, hash)) ?? []))
  })
}
