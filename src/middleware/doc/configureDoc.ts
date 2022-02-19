import { Application } from 'express'
import swaggerAutogen from 'swagger-autogen'
// eslint-disable-next-line import/no-deprecated
import { serve, setup, SwaggerOptions } from 'swagger-ui-express'

const swaggerJsonFile = 'swagger.json'
const swaggerJsonUrl = `/doc/${swaggerJsonFile}`
const endpointsFiles = ['{src,dist}/**/*.{ts,js}']
const defaultOptions: SwaggerOptions = {
  basePath: '',
  components: {},
  consumes: ['application/json'],
  definitions: {},
  host: '',
  info: {
    description: 'API for storing & retrieving blocks/payloads in the Archivist',
    title: 'XYO Archivist API',
    version: '2.0',
  },
  produces: ['application/json'],
  schemes: ['http', 'https'],
  securityDefinitions: {},
  tags: [
    {
      description: 'Create and manage archives',
      name: 'Archive',
    },
    {
      description: 'Add and query boundwitness blocks',
      name: 'Block',
    },
    {
      description: 'Check the health of the archivist',
      name: 'Health',
    },
    {
      description: 'View metrics of the archivist',
      name: 'Metrics',
    },
    {
      description: 'Add and query payloads',
      name: 'Payload',
    },
    {
      description: 'View data about schemas used in payloads',
      name: 'Schema',
    },
    {
      description: 'Add and query payloads',
      name: 'Payload',
    },
    {
      description: 'Manage user accounts and profiles',
      name: 'User',
    },
  ],
}

const uiOptions = {
  swaggerOptions: {
    apiSorter: 'alpha',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operationsSorter: function (a: any, b: any) {
      const order: Record<string, string> = { delete: '3', get: '0', post: '1', put: '2' }
      return order[a.get('method')].localeCompare(order[b.get('method')])
    },
    tagsSorter: 'alpha',
    url: swaggerJsonUrl,
  },
}

export interface ConfigureDocOptions {
  host: string
}

export const configureDoc = async (app: Application, options: ConfigureDocOptions) => {
  app.get(swaggerJsonUrl, (req, res) => res.sendFile(swaggerJsonFile, { root: './' }))
  const schemes = options.host.includes('localhost') ? ['http'] : ['https']
  const mergedOptions = { ...defaultOptions, ...options, schemes }
  await swaggerAutogen()(swaggerJsonFile, endpointsFiles, mergedOptions)

  // eslint-disable-next-line import/no-deprecated
  app.use('/doc', serve, setup(undefined, uiOptions))
}
