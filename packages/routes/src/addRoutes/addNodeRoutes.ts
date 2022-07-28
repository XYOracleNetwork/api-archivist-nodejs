import { allowAnonymous, archiveLocals, requireAccountOperationAccess } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

import { getByHash, getQuery, postNode } from '../routes'

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
