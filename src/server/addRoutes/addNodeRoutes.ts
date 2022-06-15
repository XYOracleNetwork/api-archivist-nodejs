import { Express } from 'express'

import { getByHash } from '../../hash'
import { allowAnonymous, archiveLocals, requireAccountOperationAccess } from '../../middleware'
import { postNode } from '../../post'
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
    '/query/:id',
    allowAnonymous,
    getQuery
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Get the status of a query from the archivist' */
  )

  app.post(
    '/:archive',
    archiveLocals,
    requireAccountOperationAccess,
    postNode
    /* #swagger.tags = ['Node'] */
    /* #swagger.summary = 'Execute the supplied queries, contained as Payloads in one or more Bound Witnesses. Implementation is specific to the supplied payload schemas.' */
  )
}
