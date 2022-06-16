import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { findPayload, requestAccessibleArchives } from '../../lib'
import { PayloadPointer } from './PayloadPointer'
import { combineRules } from './PayloadRules'

export const resolvePayloadPointer = async (req: Request, pointer: XyoPayload<PayloadPointer>): Promise<XyoPayload | undefined> => {
  const { archive, direction, schema, timestamp } = combineRules(pointer.reference)
  const accessibleArchives = await requestAccessibleArchives(req, archive)
  if (!accessibleArchives.length) return undefined
  return findPayload(accessibleArchives, schema, timestamp, direction)
}
