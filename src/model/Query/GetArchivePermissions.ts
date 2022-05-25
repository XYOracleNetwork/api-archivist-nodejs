import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissions } from '../Domain'
import { Query } from './Query'

export const getArchivePermissionsSchema = 'network.xyo.security.archive.permissions.get'
export type GetArchivePermissionsSchema = typeof getArchivePermissionsSchema

export interface GetArchivePermissions extends Query {
  allow?: Partial<ArchivePermissions>
  reject?: Partial<ArchivePermissions>
  schema: GetArchivePermissionsSchema
}

export type GetArchivePermissionsPayload = XyoPayload<GetArchivePermissions>
