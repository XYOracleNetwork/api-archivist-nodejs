import { XyoPayload, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissions } from '../Domain'
import { Query } from './Query'

export const setArchivePermissionsSchema = 'network.xyo.security.archive.permissions.set'
export type SetArchivePermissionsSchema = typeof setArchivePermissionsSchema

export interface SetArchivePermissions {
  allow?: Partial<ArchivePermissions>
  reject?: Partial<ArchivePermissions>
  schema: SetArchivePermissionsSchema
}

export type SetArchivePermissionsPayloadWithMeta = XyoQueryPayloadWithMeta<SetArchivePermissions>
export type SetArchivePermissionsPayload = XyoPayload<SetArchivePermissions>

export class SetArchivePermissionsQuery extends Query<SetArchivePermissionsPayload> {}
