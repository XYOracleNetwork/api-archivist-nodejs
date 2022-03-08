import { NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SchemaPathParams } from '../../schemaPathParams'
import { SchemaCache } from '../SchemaCache'

const handler: RequestHandler<SchemaPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const { schema } = req.params
  console.log(`Yo: ${schema}`)
  if (!schema) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  } else {
    res.json((await SchemaCache.get().get(schema)) ?? undefined)
    next()
  }
}

export const getSchema = handler
