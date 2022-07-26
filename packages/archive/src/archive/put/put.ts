import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { isLegacyPrivateArchive, isValidArchiveName, setArchiveAccessPrivate, setArchiveAccessPublic } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

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

  const accessControl = isLegacyPrivateArchive(req.body)
  try {
    // Create/update archive and set legacy permissions
    const result = await req.app.archiveArchivist.insert({ accessControl, archive, user: user.id })
    // Set newer permissions
    if (alsoSetNewerPermissions) {
      accessControl ? await setArchiveAccessPublic(req.app.archivePermissionsArchivist, archive) : await setArchiveAccessPrivate(req.app.archivePermissionsArchivist, archive)
    }
    res.status(result.updated ? StatusCodes.OK : StatusCodes.CREATED).json(result)
  } catch (error) {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const putArchive = asyncHandler(handler)
