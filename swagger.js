import swaggerAutogen from 'swagger-autogen'

export const doc = {
  // by default: 'localhost:3000'
  basePath: '',

  // by default: empty object
  components: {},

  // by default: ['http']
  consumes: [],

  // by default: empty object (Swagger 2.0)
  definitions: {},

  host: '',

  info: {
    // by default: 'REST API'
    description: 'Archivist API',

    // by default: '1.0.0'
    title: '',
    version: '', // by default: ''
  },

  // by default: ['application/json']
  produces: [],

  // by default: '/'
  schemes: [],

  securityDefinitions: {},

  // by default: ['application/json']
  tags: [
    // by default: empty Array
    // {
    //   // Tag name
    //   description: '',
    //   name: 'Payloads', // Tag description
    // },
    // { ... }
  ], // by default: empty object (OpenAPI 3.x)
}

const outputFile = './swagger.json'
// const endpointsFiles = ['dist/node/index.js']
const endpointsFiles = ['src/**/*.ts']

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen()(outputFile, endpointsFiles, doc)
