// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NoReqParams } from '@xylabs/sdk-api-express-ecs'
// import { setRawResponseFormat } from '@xyo-network/archivist-middleware'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

interface NodeInfo {
  address: string
  queries: string[]
  url: string
}

const nodeInfoFromModule = (module: Module<never>): NodeInfo => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  const url = `/${address}`
  return { address, queries, url }
}

const nodeDescription: NodeInfo[] = []

let populated = false

const populateNodeDescription = (req: Request) => {
  const { payloadsArchivist, boundWitnessesArchivist, schemaStatsDiviner, payloadStatsDiviner, boundWitnessStatsDiviner } = req.app
  nodeDescription.push(
    ...[payloadsArchivist, boundWitnessesArchivist, schemaStatsDiviner, payloadStatsDiviner, boundWitnessStatsDiviner].map(nodeInfoFromModule),
  )
  populated = true
}

const handler: RequestHandler<NoReqParams> = (req, res) => {
  // setRawResponseFormat(res)
  if (!populated) populateNodeDescription(req)
  res.json(nodeDescription)
}

// export const getNode = asyncHandler(handler)
export const getNode = handler
