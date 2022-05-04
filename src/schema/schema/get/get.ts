import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload, XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SchemaPathParams } from '../../schemaPathParams'

const handler: RequestHandler<SchemaPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const { schema } = req.params
  if (!schema) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  } else {
    XyoSchemaCache.instance.proxy = `http://localhost:${req.socket.localPort}/domain`
    const schemaCacheEntry = await XyoSchemaCache.instance.get(schema)
    res.json(schemaCacheEntry?.payload ?? undefined)
    next()
  }
}

export const getSchema = asyncHandler(handler)
