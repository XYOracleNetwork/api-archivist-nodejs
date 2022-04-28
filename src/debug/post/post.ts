import { RequestHandler } from 'express'
import { AllowedSchema, Validator } from 'express-json-validator-middleware'

const requestSchema: AllowedSchema = {
  properties: {
    street: {
      type: 'string',
    },
  },
  required: ['street'],
  type: 'object',
}

const { validate } = new Validator({})

const requestValidator: RequestHandler = validate({ body: requestSchema })

const handler: RequestHandler = (req, res, _next) => {
  res.json({ valid: true })
}

export const postDebug: RequestHandler[] = [requestValidator, handler]
