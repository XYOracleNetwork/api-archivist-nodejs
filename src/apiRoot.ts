import 'source-map-support/register'

import { ApiStage } from '@xyo-network/sdk-xyo-js'
import lambda from 'aws-lambda'

import apiStage from './apiStage'

const apiRoot = (event: lambda.APIGatewayProxyEvent) => {
  if (apiStage(event) === ApiStage.Local) {
    return `http://${event.headers.Host}/dev`
  } else {
    return `https://${event.headers.Host}`
  }
}

export default apiRoot
