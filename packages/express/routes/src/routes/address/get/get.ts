// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getModuleDescription } from '@xyo-network/archivist-lib'
import { ModuleDescription } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

import { AddressPathParams } from './AddressPathParams'
import { isModule } from './isModule'

const activeModules: Record<string, Module<never>> = {}

let populated = false

const populateActiveModules = (req: Request) => {
  const { payloadsArchivist, boundWitnessesArchivist, schemaStatsDiviner, payloadStatsDiviner, boundWitnessStatsDiviner } = req.app
  const modules = [payloadsArchivist, boundWitnessesArchivist, schemaStatsDiviner, payloadStatsDiviner, boundWitnessStatsDiviner]
  modules.filter(isModule).forEach((mod) => {
    activeModules[mod.address] = mod
  })
  populated = true
}

const handler: RequestHandler<AddressPathParams, ModuleDescription> = (req, res, next) => {
  if (!populated) populateActiveModules(req)
  const { address } = req.params
  if (address) {
    // TODO: ToLower and remove hex prefix
    const mod = activeModules[address]
    if (mod) {
      res.json(getModuleDescription(mod))
      return
    }
  }
  next('route')
}

// export const getAddress = asyncHandler(handler)
export const getAddress = handler
