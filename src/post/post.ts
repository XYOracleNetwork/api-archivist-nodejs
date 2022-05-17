import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

// const handler: RequestHandler<NoReqParams, XyoArchive[]> = async (req, res, next) => {
const handler: RequestHandler<NoReqParams, XyoArchive[]> = (req, res, next) => {
  const { schemaRegistry } = res.app.locals
  if (!schemaRegistry) {
    next()
    return
  }
  // TODO: What is the schema
  // TODO: Is the archive private
  const id = req?.user?.id
  if (!id) {
    res.json()
  } else {
    res.json()
  }
  next()
}

export const postPayload = asyncHandler(handler)
