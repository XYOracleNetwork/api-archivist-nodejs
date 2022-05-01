import { Express } from 'express'

import { getDebug, postDebug } from '../debug'
import { allowAnonymous, isDevelopment } from '../middleware'

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
