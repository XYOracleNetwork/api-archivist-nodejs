// import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { Module } from '@xyo-network/module'
import { Request, RequestHandler } from 'express'

import { AddressPathParams } from './AddressPathParams'

const activeModules: Record<string, Module<never>> = {}

const isModule = (x: Module<never> | Partial<Module<never>>): x is Module<never> => {
  return x && x?.address && x?.queries ? true : false
}

const populateAll = false
let populated = false

const populateActiveModules = (req: Request) => {
  if (populateAll) {
    Object.values(req.app)
      .filter(isModule)
      .forEach((mod) => {
        activeModules[mod.address] = mod
      })
  } else {
    const mod: Module<never> = req.app.payloadsArchivist
    activeModules[mod.address] = mod
  }
  populated = true
}

const handler: RequestHandler<AddressPathParams> = (req, res, next) => {
  if (!populated) populateActiveModules(req)
  const { address } = req.params
  if (address) {
    // TODO: ToLower and remove hex prefix
    const mod = activeModules[address]
    if (mod) {
      const queries = mod.queries()
      const info = { address, queries }
      res.json(info)
      return
    }
  }
  next('route')
}

// export const getAddress = asyncHandler(handler)
export const getAddress = handler
