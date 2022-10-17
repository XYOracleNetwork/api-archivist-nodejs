// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getModuleDescription } from '@xyo-network/archivist-lib'
import { ModuleDescription } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

import { AddressPathParams } from '../AddressPathParams'
import { isModule } from './isModule'

const activeModules: Record<string, Module> = {}

let populated = false

const populateStaticModules = (req: Request) => {
  Object.values(req.app)
    .filter(isModule)
    .forEach((mod) => {
      activeModules[mod.address] = mod
    })
  populated = true
}

const handler: RequestHandler<AddressPathParams, ModuleDescription> = (req, res, next) => {
  if (!populated) populateStaticModules(req)
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
