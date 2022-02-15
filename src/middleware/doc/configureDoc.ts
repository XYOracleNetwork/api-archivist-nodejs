import { Application } from 'express'
import swaggerAutogen from 'swagger-autogen'
// eslint-disable-next-line import/no-deprecated
import { serve, setup } from 'swagger-ui-express'

const swaggerJsonFile = 'swagger.json'
const swaggerJsonUrl = `/doc/${swaggerJsonFile}`
const endpointsFiles = ['{src,dist}/**/*.{ts,js}']
const defaultOptions = {
  basePath: '',
  components: {},
  consumes: ['application/json'],
  definitions: {},
  host: '',
  info: {
    description: 'Routes for storing & retrieving blocks/payloads in the Archivist',
    title: 'Archivist API',
    version: '1.0',
  },
  produces: ['application/json'],
  schemes: ['http', 'https'],
  securityDefinitions: {},
  tags: [],
}

const opts = {
  swaggerOptions: {
    url: swaggerJsonUrl,
  },
}

export interface IConfigureDocOptions {
  host: string
}

export const configureDoc = async (app: Application, options: IConfigureDocOptions) => {
  app.get(swaggerJsonUrl, (req, res) => res.sendFile(swaggerJsonFile, { root: './' }))
  const mergedOptions = { ...defaultOptions, ...options }
  await swaggerAutogen()(swaggerJsonFile, endpointsFiles, mergedOptions)
  // eslint-disable-next-line import/no-deprecated
  app.use('/doc', serve, setup(undefined, opts))
}
