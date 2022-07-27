import { notImplemented } from '@xylabs/sdk-api-express-ecs'
import { requireArchiveAccess } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

import { getArchivePayloadHash, getArchivePayloadRecent, getArchivePayloadRepair, getArchivePayloads, getArchivePayloadStats } from '../../archive'

export const addPayloadRoutes = (app: Express) => {
  app.get(
    '/archive/:archive/payload',
    requireArchiveAccess,
    getArchivePayloads
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get payloads' */
  )

  app.get(
    '/archive/:archive/payload/stats',
    requireArchiveAccess,
    getArchivePayloadStats
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get payload stats' */
  )

  app.get(
    '/archive/:archive/payload/hash/:hash',
    requireArchiveAccess,
    getArchivePayloadHash
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get payloads by hash' */
  )

  /* Todo: Should this be a POST or PUT instead? */
  app.get(
    '/archive/:archive/payload/hash/:hash/repair',
    requireArchiveAccess,
    getArchivePayloadRepair
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Repair a payload' */
  )

  app.get(
    '/archive/:archive/payload/recent/:limit?',
    requireArchiveAccess,
    getArchivePayloadRecent
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get the most recent payloads' */
  )

  app.get(
    '/archive/:archive/payload/sample/:size?',
    requireArchiveAccess,
    notImplemented
    /* #swagger.deprecated = true */
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get a random sampling of payloads' */
  )

  app.get(
    '/archive/:archive/payload/chain/:hash/:limit?',
    requireArchiveAccess,
    notImplemented
    /* #swagger.deprecated = true */
    /* #swagger.tags = ['Payload'] */
    /* #swagger.summary = 'Get a proof of origin chain starting from a payload hash' */
  )
}
