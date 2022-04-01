import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoDomainConfig, XyoDomainConfigWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

export type DomainPathParams = {
  domain: string
}

const handler: RequestHandler<DomainPathParams, XyoDomainConfig> = async (req, res, next) => {
  const { domain } = req.params
  const wrapper = new XyoDomainConfigWrapper()
  const config = await wrapper.discover(domain)
  res.json(config)
  next()
}

export const getDomain = asyncHandler(handler)
