import { RequestHandler } from 'express'
import { AllowedSchema, Validator } from 'express-json-validator-middleware'

const requestBodySchema: AllowedSchema = {
  properties: {
    test: {
      type: 'string',
    },
  },
  required: ['test'],
  type: 'object',
}

const { validate } = new Validator({})

const requestValidator: RequestHandler = validate({ body: requestBodySchema })

const handler: RequestHandler = (_req, res, _next) => {
  res.json({ valid: true })
}

export const postDebug: RequestHandler[] = [requestValidator, handler]
