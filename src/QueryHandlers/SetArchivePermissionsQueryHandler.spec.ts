import { mock, MockProxy } from 'jest-mock-extended'

import { ArchivePermissionsRepository } from '../middleware'
import { debugSchema, SetArchivePermissionsPayloadWithMeta, SetArchivePermissionsQuery, setArchivePermissionsSchema } from '../model'
import { SetArchivePermissionsQueryHandler } from './SetArchivePermissionsQueryHandler'

const _archive = 'test'
const _hash = '1234567890'
const _timestamp = Date.now()
const allowedAddress = '0x8ba1f109551bd432803012645ac136ddd64dba72'
const disallowedAddress = '0x0ac1df02185025f65202660f8167210a80dd5086'
const allowedSchema = 'network.xyo.test'
const disallowedSchema = debugSchema
const _queryId = '0'

const getQueryPayload = (
  allowedAddresses: string[] = [allowedAddress],
  disallowedAddresses: string[] = [disallowedAddress],
  allowedSchemas: string[] = [allowedSchema],
  disallowedSchemas: string[] = [disallowedSchema]
): SetArchivePermissionsPayloadWithMeta => {
  return {
    _archive,
    _hash,
    _queryId,
    _timestamp,
    addresses: {
      allow: allowedAddresses,
      reject: disallowedAddresses,
    },
    schema: setArchivePermissionsSchema,
    schemas: {
      allow: allowedSchemas,
      reject: disallowedSchemas,
    },
  }
}

describe('SetArchivePermissionsQueryHandler', () => {
  describe('handle', () => {
    let archivePermissionsRepository: MockProxy<ArchivePermissionsRepository>
    let sut: SetArchivePermissionsQueryHandler
    beforeEach(() => {
      archivePermissionsRepository = mock<ArchivePermissionsRepository>()
      archivePermissionsRepository.get.mockResolvedValue([getQueryPayload()])
      archivePermissionsRepository.insert.mockResolvedValue([getQueryPayload()])
      sut = new SetArchivePermissionsQueryHandler({ archivePermissionsRepository })
    })
    describe('with valid permissions', () => {
      it('sets the permissions for the archive', async () => {
        await sut.handle(new SetArchivePermissionsQuery({ ...getQueryPayload() }))
      })
    })
    describe('with invalid permissions', () => {
      it('detects missing archive', async () => {
        const payload: Partial<SetArchivePermissionsPayloadWithMeta> = getQueryPayload()
        delete payload._archive
        const query = new SetArchivePermissionsQuery({ ...payload } as SetArchivePermissionsPayloadWithMeta)
        await expect(sut.handle(query)).rejects.toThrow()
      })
      it('detects duplicate address in allow/reject', async () => {
        const payload = getQueryPayload([allowedAddress], [allowedAddress], [allowedSchema], [disallowedSchema])
        const query = new SetArchivePermissionsQuery({ ...payload })
        await expect(sut.handle(query)).rejects.toThrow()
      })
      it('detects duplicate schema in allow/reject', async () => {
        const payload = getQueryPayload([allowedAddress], [disallowedAddress], [allowedSchema], [allowedSchema])
        const query = new SetArchivePermissionsQuery({ ...payload })
        await expect(sut.handle(query)).rejects.toThrow()
      })
    })
  })
})
