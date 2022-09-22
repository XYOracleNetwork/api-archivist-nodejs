// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NoReqParams } from '@xylabs/sdk-api-express-ecs'
// import { setRawResponseFormat } from '@xyo-network/archivist-middleware'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

interface NodeInfo {
  address: string
  href: string
  queries: string[]
  type: string
}

const nodeInfoFromModule = (module: Module<never>, type: string): NodeInfo => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  const href = `/${address}`
  return { address, href, queries, type }
}

type ActiveModules = Record<string, NodeInfo>

interface NodeDescription {
  archivists: ActiveModules
  diviners: ActiveModules
}

const nodeDescription: NodeDescription = {
  archivists: {},
  diviners: {},
}

let populated = false

const populateNodeDescription = (req: Request) => {
  const { payloadsArchivist, boundWitnessesArchivist, schemaStatsDiviner, payloadStatsDiviner, boundWitnessStatsDiviner } = req.app
  nodeDescription.archivists = {
    boundWitnessesArchivist: nodeInfoFromModule(boundWitnessesArchivist, 'archivist'),
    payloadsArchivist: nodeInfoFromModule(payloadsArchivist, 'archivist'),
  }
  nodeDescription.diviners = {
    boundWitnessStatsDiviner: nodeInfoFromModule(boundWitnessStatsDiviner, 'diviner'),
    payloadStatsDiviner: nodeInfoFromModule(payloadStatsDiviner, 'diviner'),
    schemaStatsDiviner: nodeInfoFromModule(schemaStatsDiviner, 'diviner'),
  }
  populated = true
}

const handler: RequestHandler<NoReqParams> = (req, res) => {
  // setRawResponseFormat(res)
  if (!populated) populateNodeDescription(req)
  res.json(nodeDescription)
}

// export const getNode = asyncHandler(handler)
export const getNode = handler
