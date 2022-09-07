import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { ArchivePayloadsArchivist } from '@xyo-network/archivist-model'
import { XyoPartialPayloadMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { BlockHashPathParams } from '../blockHashPathParams'

const getPayloadsByHashes = async (archivist: ArchivePayloadsArchivist, archive: string, hashes: string[]) => {
  const map: Record<string, XyoPartialPayloadMeta[]> = {}
  const payloads: (XyoPayloadWithMeta | undefined)[] = []
  for (const hash of hashes) {
    const result = await archivist.get([{ archive, hash }])
    const payload = result.filter(exists).pop()
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
  const bws = await archiveBoundWitnessesArchivist.get([{ archive, hash }])
  const bw = bws.filter(exists).pop()
  if (bw) {
    // TODO: remove meta
    res.json(await getPayloadsByHashes(archivePayloadsArchivist, archive, bw.payload_hashes))
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlockHashPayloads = asyncHandler(handler)
