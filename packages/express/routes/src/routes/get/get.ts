// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

const handler: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
}

// export const getNode = asyncHandler(handler)
export const getNode = handler
