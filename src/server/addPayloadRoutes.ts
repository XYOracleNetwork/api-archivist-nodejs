import { Express } from 'express'

import {
  getArchivePayloadHash,
  getArchivePayloadRecent,
  getArchivePayloadRepair,
  getArchivePayloadStats,
} from '../archive'
import { requireArchiveAccess } from '../middleware'
import { notImplemented } from './notImplemented'

export const addPayloadRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/stats', getArchivePayloadStats /* #swagger.tags = ['payload'] */)
  app.get(
    '/archive/:archive/payload/hash/:hash',
    requireArchiveAccess,
    getArchivePayloadHash /* #swagger.tags = ['payload'] */
  )

  /* Todo: Should this be a POST or PUT instead? */
  app.get(
    '/archive/:archive/payload/hash/:hash/repair',
    requireArchiveAccess,
    getArchivePayloadRepair
    /* #swagger.tags = ['payload'] */
    /* #swagger.summary = 'Repair a payload' */
  )

  app.get(
    '/archive/:archive/payload/recent/:limit?',
    requireArchiveAccess,
    getArchivePayloadRecent
    /* #swagger.tags = ['payload'] */
    /* #swagger.summary = 'Get the most recent payloads' */
  )
  app.get(
    '/archive/:archive/payload/sample/:size?',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['payload'] */
    /* #swagger.summary = 'Get a random sampling of payloads' */
  )
  app.get(
    '/archive/:archive/payload/chain/:hash?',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['payload'] */
    /* #swagger.summary = 'Get a proof of origin chain starting from a payload hash' */
  )
}
