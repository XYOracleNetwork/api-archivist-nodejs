// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

export type AddressPathParams = {
  address: string
}

const handler: RequestHandler<AddressPathParams> = (req, res, next) => {
  next('route')
}

// export const getAddress = asyncHandler(handler)
export const getAddress = handler
