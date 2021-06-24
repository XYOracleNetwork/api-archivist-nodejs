import 'source-map-support/register'

import lambda from 'aws-lambda'

import { Result } from '../lib'

export const entryPoint = (
  event: lambda.APIGatewayProxyEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
) => {
  const result = event.requestContext
  return Result.Ok(callback, result)
}
