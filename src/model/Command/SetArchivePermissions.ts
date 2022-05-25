import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissions } from '../Domain'
import { Command } from './Command'

export const setArchivePermissionsSchema = 'network.xyo.security.archive.permissions.set'
export type SetArchivePermissionsSchema = typeof setArchivePermissionsSchema

export interface SetArchivePermissions extends Command {
  allow?: Partial<ArchivePermissions>
  reject?: Partial<ArchivePermissions>
  schema: SetArchivePermissionsSchema
}

export type SetArchivePermissionsPayload = XyoPayload<SetArchivePermissions>
