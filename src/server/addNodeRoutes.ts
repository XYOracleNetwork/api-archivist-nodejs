import { Express } from 'express'

import { getByHash } from '../hash'
import { allowAnonymous } from '../middleware'
import { postPayloads } from '../post'

export const addNodeRoutes = (app: Express) => {
  app.get(
    '/:hash',
    allowAnonymous,
    getByHash
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the HURI from the archivist' */
  )

  app.post(
    '/',
    allowAnonymous,
    postPayloads
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Query the payloads, implementation is dependent on payload schema' */
  )
}
