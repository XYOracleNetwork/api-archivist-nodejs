import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadHashPathParams } from '../payloadHashPathParams'

const handler: RequestHandler<PayloadHashPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const query: XyoArchivistGetQuery = {
    hashes: [{ archive, hash }] as unknown as string[],
    schema: XyoArchivistGetQuerySchema,
  }
  const result = await archivist.query(query)
  const payload = result?.[1].filter(exists).map((payload) => new XyoPayloadWrapper(payload).body)?.[0]
  res.json(payload ? [payload] : [])
}

export const getArchivePayloadHash = asyncHandler(handler)
