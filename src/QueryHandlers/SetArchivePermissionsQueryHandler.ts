import { assertEx } from '@xylabs/sdk-js'
import { XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../middleware'
import { QueryHandler, SetArchivePermissionsPayload, SetArchivePermissionsPayloadWithMeta, SetArchivePermissionsQuery, setArchivePermissionsSchema } from '../model'

export interface SetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

const validateAddresses = (query: SetArchivePermissionsQuery) => {
  const allowed = query?.payload?.allow?.addresses
  const disallowed = query?.payload?.reject?.addresses
  validateArraysAreDistinct(allowed, disallowed)
}
const validateSchema = (query: SetArchivePermissionsQuery) => {
  const allowed = query?.payload?.allow?.schemas
  const disallowed = query?.payload?.reject?.schemas
  validateArraysAreDistinct(allowed, disallowed)
}
const validateArraysAreDistinct = (allowed?: string[], disallowed?: string[]) => {
  if (allowed && disallowed) {
    const duplicates = allowed.filter((address) => disallowed.includes(address))
    assertEx(duplicates.length === 0, 'Value must not exist in both allowed & disallowed')
  }
}

export class SetArchivePermissionsQueryHandler implements QueryHandler<SetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: SetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: SetArchivePermissionsQuery): Promise<SetArchivePermissionsPayload> {
    const archive = assertEx(query.payload._archive)
    validateAddresses(query)
    validateSchema(query)
    await this.opts.archivePermissionsRepository.insert([query.payload])
    const permissions = await this.opts.archivePermissionsRepository.get(archive)
    const currentPermissions = assertEx(permissions?.[0])
    return new XyoPayloadBuilder<SetArchivePermissionsPayloadWithMeta>({ schema: setArchivePermissionsSchema })
      .fields({ ...currentPermissions, _queryId: query.id, _timestamp: Date.now() })
      .build()
  }
}
