import lambda from 'aws-lambda'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const defaultHeaders = {
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': '*',
}

const Result = {
  BadRequest: (
    callback: lambda.APIGatewayProxyCallback,
    body?: { message?: string },
    headers?: Record<string, number | string | boolean>
  ) => {
    let bodyString
    if (body === undefined) {
      bodyString = ReasonPhrases.BAD_REQUEST
    } else if (typeof body === 'string') {
      bodyString = body
    } else {
      bodyString = body.message ?? JSON.stringify(body)
    }
    callback(null, {
      body: bodyString,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.BAD_REQUEST,
    })
  },

  Forbidden: (
    callback: lambda.APIGatewayProxyCallback,
    error?: Error,
    headers?: Record<string, number | string | boolean>
  ) => {
    console.log(`${StatusCodes.FORBIDDEN}:${error}`)
    callback(null, {
      body: error ? `${JSON.stringify(error)}` : ReasonPhrases.FORBIDDEN,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.FORBIDDEN,
    })
  },

  InternalServerError: (
    callback: lambda.APIGatewayProxyCallback,
    error?: Error,
    headers?: Record<string, number | string | boolean>
  ) => {
    console.error(`${StatusCodes.INTERNAL_SERVER_ERROR}:${error}`)
    callback(null, {
      body: error ? `${JSON.stringify(error)}` : ReasonPhrases.INTERNAL_SERVER_ERROR,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    })
  },

  NotFound: (callback: lambda.APIGatewayProxyCallback, headers?: Record<string, number | string | boolean>) => {
    callback(null, {
      body: ReasonPhrases.NOT_FOUND,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.NOT_FOUND,
    })
  },

  Ok: (
    callback: lambda.APIGatewayProxyCallback,
    body: unknown,
    headers?: Record<string, number | string | boolean>
  ) => {
    let bodyString
    if (typeof body === 'string') {
      bodyString = body
    } else {
      bodyString = JSON.stringify(body)
    }
    callback(null, {
      body: bodyString,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.OK,
    })
  },

  Redirect: (
    callback: lambda.APIGatewayProxyCallback,
    url: string,
    headers?: Record<string, number | string | boolean>
  ) => {
    callback(null, {
      body: url,
      headers: { ...defaultHeaders, ...headers, Location: url },
      statusCode: StatusCodes.TEMPORARY_REDIRECT,
    })
  },

  Unauthorized: (
    callback: lambda.APIGatewayProxyCallback,
    error?: Error,
    headers?: Record<string, number | string | boolean>
  ) => {
    console.log(`${StatusCodes.UNAUTHORIZED}:${error}`)
    callback(null, {
      body: error ? `${JSON.stringify(error)}` : ReasonPhrases.UNAUTHORIZED,
      headers: { ...defaultHeaders, ...headers },
      statusCode: StatusCodes.UNAUTHORIZED,
    })
  },
}

export default Result
