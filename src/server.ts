import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
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

interface ExpressError extends Error {
  statusCode?: number
}

const server = (port = 80) => {
  const app = express()

  const getNotImplemented = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
    next({
      message: 'Not Implemented',
    })
  }

  app.set('etag', false)

  app.use(bodyParser.json())

  app.get('/', (req, res, next) => {
    res.json({ alive: true })
    next()
  })

  app.get('/archive', getNotImplemented)
  app.get('/archive/:archive', getNotImplemented)

  app.get('/archive/:archive/payload/schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/stats', getNotImplemented)
  app.get('/archive/:archive/payload/schema/:schema/recent/limit', getNotImplemented)

  app.post('/archive/:archive/block', asyncHandler(postArchiveBlock))
  app.get('/archive/:archive/block/stats', asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/block/hash:', asyncHandler(getArchiveBlockHash))
  app.get('/archive/:archive/block/recent/limit:', asyncHandler(getArchiveBlockRecent))

  app.get('/archive/:archive/payload/stats', asyncHandler(getArchiveBlockStats))
  app.get('/archive/:archive/payload/hash:', asyncHandler(getArchivePayloadHash))
  app.get('/archive/:archive/payload/hash:/repair', asyncHandler(getArchivePayloadRepair))
  app.get('/archive/:archive/payload/recent/limit:', asyncHandler(getArchivePayloadRecent))

  app.use((error: ExpressError, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      console.error(error.message)
      if (!error.statusCode) error.statusCode = 500
      res.status(error.statusCode).send({ error: error.message })
    }
    next(error)
  })

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })
}

export { server }
