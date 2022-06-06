import { Express } from 'express'

import { getByHash } from '../../hash'
import { allowAnonymous, requireAccountOperationAccess } from '../../middleware'
import { postPayloads } from '../../post'
import { getQuery } from '../../query'

export const addNodeRoutes = (app: Express) => {
  app.get(
    '/:hash',
    allowAnonymous,
    getByHash
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the HURI from the archivist' */
  )

  app.get(
    '/query/:hash',
    allowAnonymous,
    getQuery
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the status of a query from the archivist' */
  )

  app.post(
    '/:archive?',
    requireAccountOperationAccess,
    postPayloads
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Query the payloads, implementation is dependent on payload schema' */
  )
}
