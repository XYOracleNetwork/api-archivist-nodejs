import 'source-map-support/register'

import { CoinError } from '@xylabs/sdk-coin-js'
import lambda from 'aws-lambda'

import Result from './Result'

const trapServerError = async (callback: lambda.APIGatewayProxyCallback, closure: () => Promise<void>) => {
  try {
    await closure()
  } catch (ex) {
    const coinError = ex as CoinError
    if (coinError.status) {
      delete coinError.internalError
      delete coinError.stack
      console.error(coinError)
      return callback(null, {
        body: JSON.stringify(coinError),
        statusCode: coinError.status,
      })
    } else {
      return Result.InternalServerError(callback, ex)
    }
  }
}

export default trapServerError
