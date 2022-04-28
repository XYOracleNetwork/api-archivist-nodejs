import { Express } from 'express'

import { getDebug, postDebug } from '../debug'
import { allowAnonymous } from '../middleware'

export type NodeEnv = 'production' | 'development' | undefined

// TODO: Move to Express SDK
export const isDevelopment = () => {
  return (process.env.NODE_ENV as NodeEnv) === 'development'
}

export const isProduction = () => {
  return (process.env.NODE_ENV as NodeEnv) === 'production'
}

export const addDebugRoutes = (app: Express) => {
  if (isDevelopment()) {
    app.get(
      '/debug',
      getDebug
      /* #swagger.tags = ['Debug'] */
      /* #swagger.ignore = true */
      /* #swagger.summary = 'Get debug route' */
    )

    app.post(
      '/debug',
      allowAnonymous,
      postDebug
      /* #swagger.tags = ['Debug'] */
      /* #swagger.ignore = true */
      /* #swagger.summary = 'Post debug route' */
    )
  }
}
