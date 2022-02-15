import swaggerAutogen from 'swagger-autogen'

export const doc = {
  basePath: '',
  components: {},
  consumes: ['application/json'],
  definitions: {},
  host: '',
  info: {
    description: 'Routes for storing & retrieving blocks/payloads in the Archivist',
    title: 'Archivist API',
    version: '2.0',
  },
  produces: ['application/json'],
  schemes: ['http', 'https'],
  securityDefinitions: {},
  tags: [
    // by default: empty Array
    // {
    //   // Tag name
    //   description: '',
    //   name: 'Payloads', // Tag description
    // },
    // { ... }
  ],
}

const outputFile = './swagger.json'
// const endpointsFiles = ['dist/node/index.js']
const endpointsFiles = ['src/**/*.ts']

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen()(outputFile, endpointsFiles, doc)
