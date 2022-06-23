import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { requestAccessibleArchives } from '../../lib'
import { findPayload } from './findPayload'
import { PayloadPointer } from './PayloadPointer'
import { combineRules } from './PayloadRules'

export const resolvePayloadPointer = async (req: Request, pointer: XyoPayload<PayloadPointer>): Promise<XyoPayload | undefined> => {
  const searchCriteria = combineRules(pointer.reference)
  const accessibleArchives = await requestAccessibleArchives(req, searchCriteria.archive)
  if (!accessibleArchives.length) return undefined
  searchCriteria.archive = accessibleArchives
  return findPayload(searchCriteria)
}
