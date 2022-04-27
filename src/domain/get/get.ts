import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoDomainConfig, XyoDomainConfigWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export type DomainPathParams = {
  domain: string
}

const handler: RequestHandler<DomainPathParams, XyoDomainConfig> = async (req, res, next) => {
  const { domain } = req.params
  const config = await XyoDomainConfigWrapper.discover(domain)
  if (config) {
    res.json(config.payload)
    next()
  } else {
    next({ message: 'Config not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getDomain = asyncHandler(handler)
