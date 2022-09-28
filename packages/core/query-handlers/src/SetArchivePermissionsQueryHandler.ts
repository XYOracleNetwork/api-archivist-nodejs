import { assertEx } from '@xylabs/assert'
import {
  XyoArchivistGetQuery,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuery,
  XyoArchivistInsertQuerySchema,
  XyoArchivistWrapper,
} from '@xyo-network/archivist'
import {
  ArchivePermissionsArchivistFactory,
  QueryHandler,
  SetArchivePermissionsPayload,
  SetArchivePermissionsPayloadWithMeta,
  SetArchivePermissionsQuery,
  SetArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { PayloadWrapper, XyoPayloadBuilder } from '@xyo-network/payload'
import { inject, injectable } from 'inversify'

const validateAddresses = (query: SetArchivePermissionsQuery) => {
  const allowed = query?.payload?.addresses?.allow
  const disallowed = query?.payload?.addresses?.reject
  validateArraysAreDistinct(allowed, disallowed)
}
const validateSchema = (query: SetArchivePermissionsQuery) => {
  const allowed = query?.payload?.schemas?.allow
  const disallowed = query?.payload?.schemas?.reject
  validateArraysAreDistinct(allowed, disallowed)
}
const validateArraysAreDistinct = (allowed?: string[], disallowed?: string[]) => {
  if (allowed && disallowed) {
    const duplicates = allowed.filter((address) => disallowed.includes(address))
    assertEx(duplicates.length === 0, 'Value must not exist in both allowed & disallowed')
  }
}

@injectable()
export class SetArchivePermissionsQueryHandler implements QueryHandler<SetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(@inject(TYPES.ArchivePermissionsArchivistFactory) protected readonly archivistFactory: ArchivePermissionsArchivistFactory) {}
  async handle(query: SetArchivePermissionsQuery): Promise<SetArchivePermissionsPayload> {
    const archive = assertEx(query.payload._archive, 'SetArchivePermissionsQueryHandler.handle: Archive not supplied')
    validateAddresses(query)
    validateSchema(query)
    const wrapper = new XyoArchivistWrapper(this.archivistFactory(archive))
    const insertPayloads = [query.payload]
    const insertQuery: XyoArchivistInsertQuery = {
      payloads: insertPayloads.map((p) => PayloadWrapper.hash(p)),
      schema: XyoArchivistInsertQuerySchema,
    }
    const insertWitness = new QueryBoundWitnessBuilder().payloads(insertPayloads).query(PayloadWrapper.hash(insertQuery)).build()
    const insertionResult = await this.archivistFactory(archive).query(insertWitness, [insertQuery, ...insertPayloads])
    assertEx(insertionResult, 'SetArchivePermissionsQueryHandler.handle: Error inserting permissions')

    const getResult = await wrapper.get([archive])
    const permissions = assertEx(
      getResult?.[0],
      'SetArchivePermissionsQueryHandler.handle: Error getting permissions',
    ) as SetArchivePermissionsPayload
    return new XyoPayloadBuilder<SetArchivePermissionsPayloadWithMeta>({ schema: SetArchivePermissionsSchema })
      .fields({ ...permissions, _queryId: query.id, _timestamp: Date.now() })
      .build()
  }
}
