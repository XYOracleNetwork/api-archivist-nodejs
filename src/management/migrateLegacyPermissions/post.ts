import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { delay } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

const handler: RequestHandler = async (req, res, next) => {
  await delay(1)
  res.status(StatusCodes.OK).json({})
  next()
}

export const postMigrateLegacyArchivePermissions = asyncHandler(handler)
