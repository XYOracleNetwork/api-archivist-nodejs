// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getModuleDescription, trimAddressPrefix } from '@xyo-network/archivist-lib'
import { ModuleDescription } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

import { AddressPathParams } from '../AddressPathParams'
import { isModule } from './isModule'

const activeModules: Record<string, Module> = {}

let enumerated = false

const enumerateStaticModules = (req: Request) => {
  Object.values(req.app)
    .filter(isModule)
    .forEach((mod) => {
      activeModules[mod.address] = mod
    })
  enumerated = true
}

const handler: RequestHandler<AddressPathParams, ModuleDescription> = (req, res, next) => {
  if (!enumerated) enumerateStaticModules(req)
  const { address } = req.params
  if (address) {
    const normalizedAddress = trimAddressPrefix(address).toLowerCase()
    const mod = activeModules[normalizedAddress]
    if (mod) {
      res.json(getModuleDescription(mod))
      return
    }
  }
  next('route')
}

// export const getAddress = asyncHandler(handler)
export const getAddress = handler
