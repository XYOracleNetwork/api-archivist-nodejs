import { requestAccessibleArchives } from '@xyo-network/archivist-lib'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { findPayload } from './findPayload'
import { PayloadPointerPayload } from './PayloadPointer'
import { combineRules } from './PayloadRules'

export const resolvePayloadPointer = async (req: Request, pointer: PayloadPointerPayload): Promise<XyoPayload | undefined> => {
  const searchCriteria = combineRules(pointer.reference)
  const accessibleArchives = await requestAccessibleArchives(req, searchCriteria.archives)
  if (!accessibleArchives.length) return undefined
  searchCriteria.archives = accessibleArchives
  return findPayload(searchCriteria)
}
