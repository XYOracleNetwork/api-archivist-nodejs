import { assertEx } from '@xylabs/assert'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema, XyoArchivistInsertQuery, XyoArchivistInsertQuerySchema } from '@xyo-network/archivist'
import {
  ArchivePermissionsArchivist,
  QueryHandler,
  SetArchivePermissionsPayload,
  SetArchivePermissionsPayloadWithMeta,
  SetArchivePermissionsQuery,
  SetArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayloadBuilder } from '@xyo-network/payload'
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
  constructor(@inject(TYPES.ArchivePermissionsArchivist) protected readonly archivePermissionsArchivist: ArchivePermissionsArchivist) {}
  async handle(query: SetArchivePermissionsQuery): Promise<SetArchivePermissionsPayload> {
    const archive = assertEx(query.payload._archive)
    validateAddresses(query)
    validateSchema(query)
    const insertQuery: XyoArchivistInsertQuery = {
      payloads: [query.payload],
      schema: XyoArchivistInsertQuerySchema,
    }
    const insertionResult = await this.archivePermissionsArchivist.query(insertQuery)
    assertEx(insertionResult, 'SetArchivePermissionsQueryHandler.handle: Error inserting permissions')
    const getQuery: XyoArchivistGetQuery = {
      hashes: [archive],
      schema: XyoArchivistGetQuerySchema,
    }
    const getResult = await this.archivePermissionsArchivist.query(getQuery)
    const currentPermissions = assertEx(
      getResult?.[1]?.[0],
      'SetArchivePermissionsQueryHandler.handle: Error getting permissions',
    ) as SetArchivePermissionsPayload
    return new XyoPayloadBuilder<SetArchivePermissionsPayloadWithMeta>({ schema: SetArchivePermissionsSchema })
      .fields({ ...currentPermissions, _queryId: query.id, _timestamp: Date.now() })
      .build()
  }
}
