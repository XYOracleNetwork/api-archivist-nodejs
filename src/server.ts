import { asyncHandler, getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import cors from 'cors'
import express, { Express, RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  getArchiveBlockHash,
  getArchiveBlockHashPayloads,
  getArchiveBlockRecent,
  getArchiveBlockStats,
  getArchivePayloadHash,
  getArchivePayloadRecent,
  getArchivePayloadRepair,
  getArchivePayloadStats,
  getArchives,
  getArchiveSettingsKeys,
  postArchiveBlock,
  postArchiveSettingsKeys,
  putArchive,
} from './archive'
import {
  configureAuth,
  configureDoc,
  jsonBodyParser,
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
  app.get('/archive/:archive', requireArchiveOwner, notImplemented /* #swagger.tags = ['archive'] */)
  app.put('/archive/:archive', requireAuth, putArchive /* #swagger.tags = ['archive'] */)
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
  app.get('/archive/:archive/payload/stats', asyncHandler(getArchivePayloadStats) /* #swagger.tags = ['payload'] */)
  app.get(
    '/archive/:archive/payload/hash/:hash',
    requireArchiveOwner,
    asyncHandler(getArchivePayloadHash) /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/hash/:hash/repair',
    requireArchiveOwner,
    asyncHandler(getArchivePayloadRepair) /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/recent/:limit?',
    requireArchiveOwner,
    asyncHandler(getArchivePayloadRecent) /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/sample/:size?',
    requireArchiveOwner,
    notImplemented /* #swagger.tags = ['payload'] */
  )
}

const addPayloadSchemaRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/schema', requireArchiveOwner, notImplemented /* #swagger.tags = ['payload'] */)
  app.get(
    '/archive/:archive/payload/schema/:schema',
    requireArchiveOwner,
    notImplemented /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/schema/:schema/stats',
    requireArchiveOwner,
    notImplemented /* #swagger.tags = ['payload'] */
  )
  app.get(
    '/archive/:archive/payload/schema/:schema/recent/limit',
    requireArchiveOwner,
    notImplemented /* #swagger.tags = ['payload'] */
  )
}

const addBlockRoutes = (app: Express) => {
  app.post('/archive/:archive/block', asyncHandler(postArchiveBlock) /* #swagger.tags = ['block'] */)
  app.post('/archive/:archive/bw', asyncHandler(postArchiveBlock) /* #swagger.tags = ['block'] */)
  app.get('/archive/:archive/block/stats', asyncHandler(getArchiveBlockStats) /* #swagger.tags = ['block'] */)
  app.get(
    '/archive/:archive/block/hash/:hash',
    requireArchiveOwner,
    asyncHandler(getArchiveBlockHash) /* #swagger.tags = ['block'] */
  )
  app.get(
    '/archive/:archive/block/hash/:hash/payloads',
    requireArchiveOwner,
    asyncHandler(getArchiveBlockHashPayloads) /* #swagger.tags = ['block'] */
  )
  app.get(
    '/archive/:archive/block/recent/:limit?',
    requireArchiveOwner,
    asyncHandler(getArchiveBlockRecent) /* #swagger.tags = ['block'] */
  )
  app.get('/archive/:archive/block/sample/:size?', requireArchiveOwner, notImplemented /* #swagger.tags = ['block'] */)
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
