import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import {
  ArchivePayloadsArchivist,
  XyoBoundWitnessWithPartialMeta,
  XyoPartialPayloadMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
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
    const bw = new QueryBoundWitnessBuilder().payload(query).build()
    const result = await archivist.query(bw, [query])
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
  const bw = new QueryBoundWitnessBuilder().payload(query).build()
  const result = await archiveBoundWitnessesArchivist.query(bw, [query])
  const block = (result?.[1]?.[0] as XyoBoundWitnessWithPartialMeta) || undefined
  if (block) {
    res.json(await getPayloadsByHashes(archivePayloadsArchivist, archive, block.payload_hashes))
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlockHashPayloads = asyncHandler(handler)
