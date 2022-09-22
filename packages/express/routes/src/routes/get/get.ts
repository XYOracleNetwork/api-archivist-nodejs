// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { Module } from '@xyo-network/module'
import { RequestHandler } from 'express'

interface NodeInfo {
  address: string
  queries: string[]
}

const infoFromModule = (module: Module<never>): NodeInfo => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  return { address, queries }
}

const handler: RequestHandler<NoReqParams, NodeInfo> = (req, res) => {
  res.json(infoFromModule(req.app.payloadsArchivist))
}

// export const getNode = asyncHandler(handler)
export const getNode = handler
