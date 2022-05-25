import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Query } from './Query'

export const getArchivePermissionsSchema = 'network.xyo.security.archive.permissions.get'
export type GetArchivePermissionsSchema = typeof getArchivePermissionsSchema

export interface GetArchivePermissions extends Query {
  _archive?: string
}

export type GetArchivePermissionsPayload = XyoPayload<GetArchivePermissions>
