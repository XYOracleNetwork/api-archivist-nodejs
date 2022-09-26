import { assertEx } from '@xylabs/assert'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import {
  ArchivePermissionsArchivist,
  GetArchivePermissionsQuery,
  QueryHandler,
  SetArchivePermissionsPayload,
  SetArchivePermissionsPayloadWithMeta,
  SetArchivePermissionsSchema,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { WithAdditional } from '@xyo-network/core'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { XyoPayloadBuilder } from '@xyo-network/payload'
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
    const archive = assertEx(query.payload._archive, 'GetArchivePermissionsQueryHandler.handle: Archive not supplied')
    const getQuery: XyoArchivistGetQuery = {
      hashes: [archive],
      schema: XyoArchivistGetQuerySchema,
    }
    const getWitness = new QueryBoundWitnessBuilder().payload(getQuery).build()
    const getResult = await this.archivePermissionsArchivist.query(getWitness, [getQuery])
    const permissions = (getResult?.[1]?.[0] as SetArchivePermissionsPayload) || getEmptyPermissions(query)
    return new XyoPayloadBuilder<SetArchivePermissionsPayloadWithMeta>({ schema: SetArchivePermissionsSchema })
      .fields({ ...permissions, _queryId: query.id, _timestamp: Date.now() })
      .build()
  }
}
