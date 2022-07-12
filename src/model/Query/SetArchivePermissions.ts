import { XyoPayload, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissions } from '../Domain'
import { Query } from './Query'

export const setArchivePermissionsSchema = 'network.xyo.security.archive.permissions.set'
export type SetArchivePermissionsSchema = typeof setArchivePermissionsSchema

export interface SetArchivePermissions {
  addresses?: ArchivePermissions
  schema: SetArchivePermissionsSchema
  schemas?: ArchivePermissions
}

export type SetArchivePermissionsPayloadWithMeta = XyoQueryPayloadWithMeta<SetArchivePermissions>
export type SetArchivePermissionsPayload = XyoPayload<SetArchivePermissions>

export class SetArchivePermissionsQuery extends Query<SetArchivePermissionsPayload> {}

export const publicArchivePermissions: SetArchivePermissionsPayload = {
  schema: setArchivePermissionsSchema,
}

export const privateArchivePermissions: SetArchivePermissionsPayload = {
  addresses: {
    allow: [],
  },
  schema: setArchivePermissionsSchema,
}
