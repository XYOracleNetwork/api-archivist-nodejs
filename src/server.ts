import { asyncHandler, Counters, errorToJsonHandler, getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

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
  postArchiveBlock,
  putArchive,
} from './archive'
import { configureAuth, IAuthConfig, jwtRequiredHandler, noAuthHandler } from './middleware'

let authHandler = noAuthHandler

const getNotImplemented = (_req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
  next({
    message: 'Not Implemented',
  })
}

const addArchiveRoutes = (app: Express) => {
  app.get('/archive', authHandler, getArchives)
  app.get('/archive/:archive', getNotImplemented)
  app.put('/archive/:archive', authHandler, putArchive)
}

const addPayloadRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/stats', authHandler, asyncHandler(getArchivePayloadStats))
  app.get('/archive/:archive/payload/hash/:hash', authHandler, asyncHandler(getArchivePayloadHash))
  app.get('/archive/:archive/payload/hash/:hash/repair', authHandler, asyncHandler(getArchivePayloadRepair))
  app.get('/archive/:archive/payload/recent/:limit?', authHandler, asyncHandler(getArchivePayloadRecent))
  app.get('/archive/:archive/payload/sample/:size?', authHandler, getNotImplemented)
}

const addPayloadSchemaRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/stats', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/recent/limit', getNotImplemented)
}

const addBlockRoutes = (app: Express) => {
  app.post('/archive/:archive/block', asyncHandler(postArchiveBlock))
  app.post('/archive/:archive/bw', asyncHandler(postArchiveBlock))
  app.get('/archive/:archive/block/stats', authHandler, asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/block/hash/:hash', authHandler, asyncHandler(getArchiveBlockHash))
  app.get('/archive/:archive/block/hash/:hash/payloads', authHandler, asyncHandler(getArchiveBlockHashPayloads))
  app.get('/archive/:archive/block/recent/:limit?', authHandler, asyncHandler(getArchiveBlockRecent))
  app.get('/archive/:archive/block/sample/:size?', getNotImplemented)
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

  if (process.env.USE_AUTH) {
    authHandler = jwtRequiredHandler
    console.log('Using JWT auth for routes')
  }

  const app = express()

  const bodyParserInstance = bodyParser.json({ type: ['application/json', 'text/json'] })

  app.use(cors())

  app.set('etag', false)

  //global counters
  app.use((req: Request, res: Response, next: NextFunction) => {
    Counters.inc(req.path)
    Counters.inc('_calls')
    next()
  })

  //if we do not trap this error, then it dumps too much to log, usually happens if request aborted
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

  app.get('/stats', (req, res, next) => {
    res.json({
      alive: true,
      avgTime: `${((Counters.counters['_totalTime'] ?? 0) / (Counters.counters['_calls'] ?? 1)).toFixed(2)}ms`,
      counters: Counters.counters,
    })
    next()
  })

  addArchiveRoutes(app)
  addPayloadRoutes(app)
  addPayloadSchemaRoutes(app)
  addBlockRoutes(app)

  if (process.env.USE_AUTH) {
    const authConfig: IAuthConfig = {
      apiKey: process.env.API_KEY,
      secretOrKey: process.env.JWT_SECRET,
    }
    const auth = await configureAuth(authConfig)
    app.use('/user', auth)
  }

  app.use(errorToJsonHandler)

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}

export { server }
