import { requestAccessibleArchives } from '@xyo-network/archivist-express-lib'
import { PayloadPointerPayload } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { combineRules } from './combineRules'
import { findPayload } from './findPayload'

export const resolvePayloadPointer = async (req: Request, pointer: PayloadPointerPayload): Promise<XyoPayload | undefined> => {
  const { boundWitnessesArchivist, payloadsArchivist } = req.app
  const searchCriteria = combineRules(pointer.reference)
  const accessibleArchives = await requestAccessibleArchives(req, searchCriteria.archives)
  if (!accessibleArchives.length) return undefined
  searchCriteria.archives = accessibleArchives
  return findPayload(boundWitnessesArchivist, payloadsArchivist, searchCriteria)
}
