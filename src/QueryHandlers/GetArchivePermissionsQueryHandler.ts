import { WithAdditional, XyoPayloadBuilder, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../middleware'
import { GetArchivePermissionsQuery, QueryHandler, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../model'

const getEmptyPermissions = (query: GetArchivePermissionsQuery): XyoPayloadWithMeta<SetArchivePermissionsPayload> => {
  return new XyoPayloadBuilder<WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>>({ schema: setArchivePermissionsSchema })
    .fields({
      _queryId: query.id,
      _timestamp: Date.now(),
    })
    .build()
}
export interface GetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: GetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: GetArchivePermissionsQuery): Promise<XyoPayloadWithMeta<SetArchivePermissionsPayload>> {
    if (!query.payload._archive) {
      return getEmptyPermissions(query)
    }
    const permissions = await this.opts.archivePermissionsRepository.get(query.payload._archive)
    return (permissions?.[0] || getEmptyPermissions(query)) as WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>
  }
}
