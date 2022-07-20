import { WithAdditional, XyoPayloadBuilder, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { inject, injectable } from 'inversify'

import { ArchivePermissionsArchivist } from '../middleware'
import { GetArchivePermissionsQuery, QueryHandler, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../model'
import { TYPES } from '../types'

const getEmptyPermissions = (query: GetArchivePermissionsQuery): XyoPayloadWithMeta<SetArchivePermissionsPayload> => {
  return new XyoPayloadBuilder<WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>>({ schema: setArchivePermissionsSchema })
    .fields({
      _queryId: query.id,
      _timestamp: Date.now(),
    })
    .build()
}

@injectable()
export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(@inject(TYPES.ArchivePermissionsArchivist) protected readonly archivePermissionsArchivist: ArchivePermissionsArchivist) {}
  async handle(query: GetArchivePermissionsQuery): Promise<XyoPayloadWithMeta<SetArchivePermissionsPayload>> {
    if (!query.payload._archive) {
      return getEmptyPermissions(query)
    }
    const permissions = await this.archivePermissionsArchivist.get(query.payload._archive)
    return (permissions?.[0] || getEmptyPermissions(query)) as WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>
  }
}
