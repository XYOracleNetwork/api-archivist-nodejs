import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import {
  ArchivePayloadsArchivist,
  XyoBoundWitnessWithPartialMeta,
  XyoPartialPayloadMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { BlockHashPathParams } from '../blockHashPathParams'

const getPayloadsByHashes = async (archivist: ArchivePayloadsArchivist, archive: string, hashes: string[]) => {
  const map: Record<string, XyoPayloadWithPartialMeta[]> = {}
  const payloads: (XyoPayloadWithPartialMeta | undefined)[] = []
  for (const hash of hashes) {
    const query: XyoArchivistGetQuery = {
      hashes: [{ archive, hash }] as unknown as string[],
      schema: XyoArchivistGetQuerySchema,
    }
    const result = await archivist.query(query)
    const payload = (result?.[1]?.[0] as XyoPayloadWithPartialMeta) || undefined
    payloads.push(payload)
  }
  payloads.forEach((value) => {
    if (value?._hash) {
      map[value._hash] = map[value._hash] ? [...map[value._hash], value] : [value]
    }
  })
  return hashes.map((value) => map[value])
}

const handler: RequestHandler<BlockHashPathParams, XyoPartialPayloadMeta[][]> = async (req, res, next) => {
  const { archive, hash } = req.params
  const { archivePayloadsArchivist, archiveBoundWitnessesArchivist } = req.app
  const query: XyoArchivistGetQuery = {
    hashes: [{ archive, hash }] as unknown as string[],
    schema: XyoArchivistGetQuerySchema,
  }
  const result = await archiveBoundWitnessesArchivist.query(query)
  const bw = (result?.[1]?.[0] as XyoBoundWitnessWithPartialMeta) || undefined
  if (bw) {
    res.json(await getPayloadsByHashes(archivePayloadsArchivist, archive, bw.payload_hashes))
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlockHashPayloads = asyncHandler(handler)
