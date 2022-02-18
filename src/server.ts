import { getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import cors from 'cors'
import express, { Express, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  getArchive,
  getArchiveBlockHash,
  getArchiveBlockHashPayloads,
  getArchiveBlockRecent,
  getArchiveBlocks,
  getArchiveBlockStats,
  getArchivePayloadHash,
  getArchivePayloadRecent,
  getArchivePayloadRepair,
  getArchivePayloads,
  getArchivePayloadStats,
  getArchives,
  getArchiveSettingsKeys,
  postArchiveBlock,
  postArchiveSettingsKeys,
  putArchive,
} from './archive'
import {
  archiveLocals,
  configureAuth,
  configureDoc,
  jsonBodyParser,
  requireArchiveAccess,
  requireArchiveOwner,
  requireAuth,
  responseProfiler,
  standardErrors,
  standardResponses,
  useRequestCounters,
} from './middleware'

const notImplemented: RequestHandler = (_req, _res, next) => {
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}

const addArchiveRoutes = (app: Express) => {
  app.get('/archive', requireAuth, getArchives /* #swagger.tags = ['archive'] */)
  app.get('/archive/:archive', requireArchiveOwner, getArchive /* #swagger.tags = ['archive'] */)
  app.put('/archive/:archive', requireAuth, putArchive /* #swagger.tags = ['archive'] */)
  app.delete('/archive/:archive', requireArchiveOwner, notImplemented /* #swagger.tags = ['archive'] */)
  app.get(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    getArchiveSettingsKeys /* #swagger.tags = ['archive'] */
  )
  app.post(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    postArchiveSettingsKeys /* #swagger.tags = ['archive'] */
  )
}

const addPayloadRoutes = (app: Express) => {
  app.get('/archive/:archive/payload', getArchivePayloads /* #swagger.tags = ['block'] */)
  app.get('/archive/:archive/payload/stats', getArchivePayloadStats /* #swagger.tags = ['payload'] */)
  app.get(
    '/archive/:archive/payload/hash/:hash',
    requireArchiveAccess,
    getArchivePayloadHash /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/hash/:hash/repair',
    requireArchiveAccess,
    getArchivePayloadRepair /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/recent/:limit?',
    requireArchiveAccess,
    getArchivePayloadRecent /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/sample/:size?',
    requireArchiveAccess,
    notImplemented /* #swagger.tags = ['payload'] */
  )
}

const addPayloadSchemaRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/schema', requireArchiveAccess, notImplemented /* #swagger.tags = ['schema'] */)
  app.get(
    '/archive/:archive/payload/schema/:schema',
    requireArchiveAccess,
    notImplemented /* #swagger.tags = ['schema'] */
  )
  app.get(
    '/archive/:archive/payload/schema/:schema/stats',
    requireArchiveAccess,
    notImplemented /* #swagger.tags = ['schema'] */
  )
  app.get(
    '/archive/:archive/payload/schema/:schema/recent/limit',
    requireArchiveAccess,
    notImplemented /* #swagger.tags = ['schema'] */
  )
}

const addBlockRoutes = (app: Express) => {
  app.get('/archive/:archive/block', getArchiveBlocks /* #swagger.tags = ['block'] */)
  app.post('/archive/:archive/block', postArchiveBlock /* #swagger.tags = ['block'] */)
  app.post('/archive/:archive/bw', postArchiveBlock /* #swagger.tags = ['block'] */)
  app.get('/archive/:archive/block/stats', getArchiveBlockStats /* #swagger.tags = ['block'] */)
  app.get(
    '/archive/:archive/block/hash/:hash',
    requireArchiveAccess,
    getArchiveBlockHash /* #swagger.tags = ['block'] */
  )
  app.get(
    '/archive/:archive/block/hash/:hash/payloads',
    requireArchiveAccess,
    getArchiveBlockHashPayloads /* #swagger.tags = ['block'] */
  )
  app.get(
    '/archive/:archive/block/recent/:limit?',
    requireArchiveAccess,
    getArchiveBlockRecent /* #swagger.tags = ['block'] */
  )
  app.get('/archive/:archive/block/sample/:size?', requireArchiveAccess, notImplemented /* #swagger.tags = ['block'] */)
}

const server = async (port = 80) => {
  // If an AWS ARN was supplied for Secrets Manager
  const awsEnvSecret = process.env.AWS_ENV_SECRET_ARN
  if (awsEnvSecret) {
    console.log('Bootstrapping ENV from AWS')
    // Merge the values from AWS into the current ENV
    // with AWS taking precedence
    const awsEnv = await getEnvFromAws(awsEnvSecret)
    Object.assign(process.env, awsEnv)
  }

  const app = express()

  app.use(responseProfiler)

  app.set('etag', false)

  app.use(jsonBodyParser)
  app.use(standardResponses)
  app.use('/archive/:archive', archiveLocals)

  if (process.env.CORS_ALLOWED_ORIGINS) {
    // CORS_ALLOWED_ORIGINS can be an array of allowed origins so we support
    // a list of comma delimited CORS origins
    const origin = process.env.CORS_ALLOWED_ORIGINS.split(',')
    app.use(cors({ origin }))
  }

  app.get('/', (_req, res, next) => {
    /* #swagger.tags = ['health'] */
    res.json({ alive: true })
    next()
  })

  useRequestCounters(app)

  addArchiveRoutes(app)
  addPayloadRoutes(app)
  addPayloadSchemaRoutes(app)
  addBlockRoutes(app)

  const userRoutes = await configureAuth({
    apiKey: process.env.API_KEY,
    secretOrKey: process.env.JWT_SECRET,
  })
  app.use('/user', userRoutes)
  const host = process.env.PUBLIC_ORIGIN || `http://localhost:${port}`
  await configureDoc(app, { host })
  app.use(standardErrors)

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}

export { server }
