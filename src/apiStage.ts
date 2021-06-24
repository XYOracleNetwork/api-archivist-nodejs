import 'source-map-support/register'

import { getApiStage } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

const apiStage = (event: lambda.APIGatewayProxyEvent) => {
  return getApiStage(event.headers?.Host ?? '')
}

export default apiStage
