import { allowAnonymous } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

import { getAddressHistory } from '../routes'

export const addAddressRoutes = (app: Express) => {
  app.get(
    '/address/:address/boundwitness',
    allowAnonymous,
    getAddressHistory,
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Get list of archives on archivist' */
  )
}
