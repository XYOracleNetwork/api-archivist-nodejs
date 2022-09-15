import {
  ArchivePermissionsArchivist,
  GetArchivePermissionsQuery,
  QueryHandler,
  SetArchivePermissionsPayload,
  SetArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { WithAdditional } from '@xyo-network/core'
import { XyoPayloadBuilder, XyoPayloadWithMeta } from '@xyo-network/payload'
import { inject, injectable } from 'inversify'

const getEmptyPermissions = (query: GetArchivePermissionsQuery): XyoPayloadWithMeta<SetArchivePermissionsPayload> => {
  return new XyoPayloadBuilder<WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>>({ schema: SetArchivePermissionsSchema })
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
    const permissions = await this.archivePermissionsArchivist.get([query.payload._archive])
    return (permissions?.[0] || getEmptyPermissions(query)) as WithAdditional<XyoPayloadWithMeta<SetArchivePermissionsPayload>>
  }
}
