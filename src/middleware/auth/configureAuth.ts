import { Router } from 'express'

import { addAuthRoutes } from './addAuthRoutes'
import { AuthConfig } from './AuthConfig'
import { configureStrategies } from './configureStrategies'

export const configureAuth: (config: AuthConfig) => Router = (config) => {
  const { jwtRequestHandler } = configureStrategies(config)
  const router = addAuthRoutes(jwtRequestHandler)
  return router
}
