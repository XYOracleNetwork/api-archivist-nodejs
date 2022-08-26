import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePayloadsArchivist } from '@xyo-network/archivist-model'
import { XyoPartialPayloadMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { BlockHashPathParams } from '../blockHashPathParams'

const getPayloadsByHashes = async (archivist: ArchivePayloadsArchivist, archive: string, hashes: string[]) => {
  const map: Record<string, XyoPartialPayloadMeta[]> = {}
  const payloads: (XyoPayloadWithMeta | undefined)[] = []
  for (const hash of hashes) {
    const payload = await archivist.get({ archive, hash })
    payloads.push(payload.pop())
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
  const bw = await archiveBoundWitnessesArchivist.get({ archive, hash })
  if (bw && bw.length > 0) {
    // TODO: remove meta
    res.json(await getPayloadsByHashes(archivePayloadsArchivist, archive, bw[0].payload_hashes))
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlockHashPayloads = asyncHandler(handler)
