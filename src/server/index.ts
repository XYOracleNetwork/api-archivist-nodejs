import { getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import cors from 'cors'
import express from 'express'

import { configureAuth, configureDoc } from '../middleware'
import { addArchiveRoutes } from './addArchiveRoutes'
import { addBlockRoutes } from './addBlockRoutes'
import { addErrorHandlers } from './addErrorHandlers'
import { addHealthChecks } from './addHealthChecks'
import { addMiddleware } from './addMiddleware'
import { addPayloadRoutes } from './addPayloadRoutes'
import { addPayloadSchemaRoutes } from './addPayloadSchemaRoutes'

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
  app.set('etag', false)

  if (process.env.CORS_ALLOWED_ORIGINS) {
    // CORS_ALLOWED_ORIGINS can be an array of allowed origins so we support
    // a list of comma delimited CORS origins
    const origin = process.env.CORS_ALLOWED_ORIGINS.split(',')
    app.use(cors({ origin }))
  }

  addMiddleware(app)
  addHealthChecks(app)
  addArchiveRoutes(app)
  addBlockRoutes(app)
  addPayloadRoutes(app)
  addPayloadSchemaRoutes(app)

  const userRoutes = await configureAuth({
    apiKey: process.env.API_KEY,
    secretOrKey: process.env.JWT_SECRET,
  })
  app.use('/user', userRoutes)
  const host = process.env.PUBLIC_ORIGIN || `http://localhost:${port}`
  await configureDoc(app, { host })

  addErrorHandlers(app)

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })

  server.setTimeout(3000)
}

export { server }
