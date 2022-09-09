import { XyoPayloadWithMeta } from '@xyo-network/payload'

import { Query } from './Query'

export const getArchivePermissionsSchema = 'network.xyo.security.archive.permissions.get'
export type GetArchivePermissionsSchema = typeof getArchivePermissionsSchema

export interface GetArchivePermissions {
  schema: GetArchivePermissionsSchema
}

export type GetArchivePermissionsPayload = XyoPayloadWithMeta<GetArchivePermissions>

export class GetArchivePermissionsQuery extends Query<GetArchivePermissionsPayload> {}
