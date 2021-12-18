import { asyncHandler, errorToJsonHandler } from '@xylabs/sdk-api-express-ecs'
import bodyParser from 'body-parser'
import express, { Express, NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import {
  getArchiveBlockHash,
  getArchiveBlockRecent,
  getArchiveBlockStats,
  getArchivePayloadHash,
  getArchivePayloadRecent,
  getArchivePayloadRepair,
  postArchiveBlock,
} from './archive'

const getNotImplemented = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
  next({
    message: 'Not Implemented',
  })
}

const addArchiveRoutes = (app: Express) => {
  app.get('/archive', getNotImplemented)
  app.get('/archive/:archive', getNotImplemented)
}

const addPayloadRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/stats', asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/payload/hash:', asyncHandler(getArchivePayloadHash))
  app.get('/archive/:archive/payload/hash:/repair', asyncHandler(getArchivePayloadRepair))
  app.get('/archive/:archive/payload/recent/limit:', asyncHandler(getArchivePayloadRecent))
}

const addPayloadSchemaRoutes = (app: Express) => {
  app.get('/archive/:archive/payload/schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/stats', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/recent/limit', getNotImplemented)
}

const addBlockRoutes = (app: Express) => {
  app.post('/archive/:archive/block', asyncHandler(postArchiveBlock))
  app.get('/archive/:archive/block/stats', asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/block/hash:', asyncHandler(getArchiveBlockHash))
  app.get('/archive/:archive/block/recent/limit:', asyncHandler(getArchiveBlockRecent))
}

const server = (port = 80) => {
  const app = express()

  app.set('etag', false)

  app.use(bodyParser.json())

  app.get('/', (req, res, next) => {
    res.json({ alive: true })
    next()
  })

  addArchiveRoutes(app)
  addPayloadRoutes(app)
  addPayloadSchemaRoutes(app)
  addBlockRoutes(app)

  app.use(errorToJsonHandler)

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
}

export { server }
