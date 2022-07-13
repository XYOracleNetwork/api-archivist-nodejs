import { getEnvFromAws, Logger } from '@xylabs/sdk-api-express-ecs'
import compression from 'compression'
import cors from 'cors'
import express, { Express } from 'express'

import dependencies from '../inversify.config'
import { configureDoc } from '../middleware'
import { addAuth } from './addAuth'
import { addDependencies } from './addDependencies'
import { addErrorHandlers } from './addErrorHandlers'
import { addHealthChecks } from './addHealthChecks'
import { addInMemoryQueryProcessing } from './addInMemoryQueryProcessing'
import { addMiddleware } from './addMiddleware'
import { addQueryConverters } from './addQueryConverters'
import { addQueryProcessors } from './addQueryProcessors'
import { addRoutes } from './addRoutes'

export const getApp = (): Express => {
  const app = express()
  app.set('etag', false)

  /*if (process.env.CORS_ALLOWED_ORIGINS) {
    // CORS_ALLOWED_ORIGINS can be an array of allowed origins so we support
    // a list of comma delimited CORS origins
    const origin = process.env.CORS_ALLOWED_ORIGINS.split(',')
    app.use(cors({ origin }))
  }*/

  app.use(cors())
  app.use(compression())

  addDependencies(app)
  addAuth(app)
  addMiddleware(app)
  addQueryConverters(app)
  addQueryProcessors(app)
  addInMemoryQueryProcessing(app)
  addHealthChecks(app)
  addRoutes(app)
  addErrorHandlers(app)
  return app
}

export const server = async (port = 80) => {
  // If an AWS ARN was supplied for Secrets Manager
  const awsEnvSecret = process.env.AWS_ENV_SECRET_ARN
  if (awsEnvSecret) {
    // Merge the values from AWS into the current ENV
    // with AWS taking precedence
    const awsEnv = await getEnvFromAws(awsEnvSecret)
    Object.assign(process.env, awsEnv)
  }

  const logger = dependencies.get<Logger>('Logger')
  const app = getApp()
  const host = process.env.PUBLIC_ORIGIN || `http://localhost:${port}`
  await configureDoc(app, { host })

  const server = app.listen(port, () => {
    logger.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}
