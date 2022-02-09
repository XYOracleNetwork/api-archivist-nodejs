import { asyncHandler, errorToJsonHandler, getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express'
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
import { getArchivesByOwner } from './lib'
import { configureAuth, requireArchiveOwner, requireAuth, useRequestCounters } from './middleware'

const notImplemented: RequestHandler = (_req, _res, next) => {
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}

const addArchiveRoutes = (app: Express) => {
  app.get('/archive', requireAuth, asyncHandler(getArchives))
  app.get('/archive/:archive', requireArchiveOwner, notImplemented)
  app.put('/archive/:archive', requireAuth, asyncHandler(putArchive))
  app.get('/archive/:archive/settings/keys', requireArchiveOwner, asyncHandler(getArchiveSettingsKeys))
  app.post('/archive/:archive/settings/keys', requireArchiveOwner, asyncHandler(postArchiveSettingsKeys))
}

const addPayloadRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/stats', asyncHandler(getArchivePayloadStats))
  app.get('/archive/:archive/payload/hash/:hash', requireArchiveOwner, asyncHandler(getArchivePayloadHash))
  app.get('/archive/:archive/payload/hash/:hash/repair', requireArchiveOwner, asyncHandler(getArchivePayloadRepair))
  app.get('/archive/:archive/payload/recent/:limit?', requireArchiveOwner, asyncHandler(getArchivePayloadRecent))
  app.get('/archive/:archive/payload/sample/:size?', requireArchiveOwner, notImplemented)
}

const addPayloadSchemaRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/schema', requireArchiveOwner, notImplemented)
  app.get('/archive/:archive/payload/schema/:schema', requireArchiveOwner, notImplemented)
  app.get('/archive/:archive/payload/schema/:schema/stats', requireArchiveOwner, notImplemented)
  app.get('/archive/:archive/payload/schema/:schema/recent/limit', requireArchiveOwner, notImplemented)
}

const addBlockRoutes = (app: Express) => {
  app.post('/archive/:archive/block', asyncHandler(postArchiveBlock))
  app.post('/archive/:archive/bw', asyncHandler(postArchiveBlock))
  app.get('/archive/:archive/block/stats', asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/block/hash/:hash', requireArchiveOwner, asyncHandler(getArchiveBlockHash))
  app.get('/archive/:archive/block/hash/:hash/payloads', requireArchiveOwner, asyncHandler(getArchiveBlockHashPayloads))
  app.get('/archive/:archive/block/recent/:limit?', requireArchiveOwner, asyncHandler(getArchiveBlockRecent))
  app.get('/archive/:archive/block/sample/:size?', requireArchiveOwner, notImplemented)
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

  const bodyParserInstance = bodyParser.json({ type: ['application/json', 'text/json'] })

  app.use(cors())

  app.set('etag', false)

  // If we do not trap this error, then it dumps too much to log, usually happens if request aborted
  app.use((req: Request, res: Response, next: NextFunction) => {
    try {
      bodyParserInstance(req, res, next)
    } catch (ex) {
      const error = ex as Error
      console.log(`bodyParser failed [${error.name}]: ${error.message}`)
    }
  })

  if (process.env.CORS_ALLOWED_ORIGINS) {
    // origin can be an array of allowed origins so we support
    // a list of comma delimited CORS origins
    const origin = process.env.CORS_ALLOWED_ORIGINS.split(',')
    const corsOptions: CorsOptions = { origin }
    app.use(cors(corsOptions))
  }

  app.get('/', (_req, res, next) => {
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
    getUserArchives: getArchivesByOwner,
    secretOrKey: process.env.JWT_SECRET,
  })
  app.use('/user', userRoutes)

  app.use(errorToJsonHandler)

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}

export { server }
