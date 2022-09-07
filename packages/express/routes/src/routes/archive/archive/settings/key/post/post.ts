import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { isValidArchiveName } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { generateArchiveKey } from './generateArchiveKey'

const handler: RequestHandler<ArchivePathParams, XyoArchiveKey> = async (req, res, next) => {
  const { user } = req
  const { archiveKeyArchivist } = req.app
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }

  const archive = req.params.archive?.toLowerCase()
  if (!isValidArchiveName(archive)) {
    next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const result = await archiveKeyArchivist.insert([generateArchiveKey(archive)])
  const key = assertEx(result.pop(), 'Error inserting key')
  res.json(key)
}

export const postArchiveSettingsKeys = asyncHandler(handler)
