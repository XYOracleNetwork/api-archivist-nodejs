import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isPrivateArchive, isValidArchiveName, setArchiveAccessPrivate, setArchiveAccessPublic } from '../../../lib'
import { ArchivePathParams } from '../../../model'

const alsoSetNewerPermissions = false

const handler: RequestHandler<ArchivePathParams, XyoArchive, XyoArchive> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }

  const archive = req.params.archive?.toLowerCase()
  if (!isValidArchiveName(archive)) {
    next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const accessControl = isPrivateArchive(req.body)
  try {
    // Create/update archive and set legacy permissions
    const result = await req.app.archiveRepository.insert({ accessControl, archive, user: user.id })
    // Set newer permissions
    if (alsoSetNewerPermissions) {
      accessControl ? await setArchiveAccessPublic(req.app.archivePermissionsRepository, archive) : await setArchiveAccessPrivate(req.app.archivePermissionsRepository, archive)
    }
    res.status(result.updated ? StatusCodes.OK : StatusCodes.CREATED).json(result)
    next()
  } catch (error) {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const putArchive = asyncHandler(handler)
