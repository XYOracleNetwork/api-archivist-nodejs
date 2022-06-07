import { mock, MockProxy } from 'jest-mock-extended'

import { ArchivePermissionsRepository } from '../middleware'
import { getArchivePermissionsSchema, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../model'
import { GetArchivePermissionsQueryHandler } from './GetArchivePermissionsQueryHandler'

const schema = getArchivePermissionsSchema
const _archive = 'test'
const emptyPermissions: SetArchivePermissionsPayload = {
  schema: 'network.xyo.security.archive.permissions.set',
}
const permissions: SetArchivePermissionsPayload = {
  allow: {
    addresses: ['0x8ba1f109551bd432803012645ac136ddd64dba72'],
    schemas: ['network.xyo.test'],
  },
  reject: {
    addresses: ['0x0ac1df02185025f65202660f8167210a80dd5086'],
    schemas: ['network.xyo.debug'],
  },
  schema: setArchivePermissionsSchema,
}

describe('GetArchivePermissionsQueryHandler', () => {
  describe('handle', () => {
    describe('when permissions for the archive', () => {
      let archivePermissionsRepository: MockProxy<ArchivePermissionsRepository>
      describe('exist', () => {
        beforeEach(() => {
          archivePermissionsRepository = mock<ArchivePermissionsRepository>()
          archivePermissionsRepository.get.mockResolvedValue([permissions, emptyPermissions])
          archivePermissionsRepository.find.mockResolvedValue([permissions, emptyPermissions])
        })
        it('returns the latest archive permissions', async () => {
          const sut = new GetArchivePermissionsQueryHandler({ archivePermissionsRepository })
          const actual = await sut.handle({ _archive, schema })
          expect(actual).toBeTruthy()
          expect(actual?.schema).toBe(setArchivePermissionsSchema)
          expect(actual?.allow).toBeDefined()
          expect(actual?.allow?.addresses).toBeDefined()
          expect(Array.isArray(actual?.allow?.addresses)).toBeTruthy()
          expect(actual?.allow?.schemas).toBeDefined()
          expect(Array.isArray(actual?.allow?.schemas)).toBeTruthy()
          expect(actual?.reject).toBeDefined()
          expect(actual?.reject?.addresses).toBeDefined()
          expect(Array.isArray(actual?.reject?.addresses)).toBeTruthy()
          expect(actual?.reject?.schemas).toBeDefined()
          expect(Array.isArray(actual?.reject?.schemas)).toBeTruthy()
        })
      })
      describe('do not exist', () => {
        beforeEach(() => {
          archivePermissionsRepository = mock<ArchivePermissionsRepository>()
          archivePermissionsRepository.get.mockResolvedValue([])
          archivePermissionsRepository.find.mockResolvedValue([])
        })
        it('returns the empty permissions', async () => {
          const sut = new GetArchivePermissionsQueryHandler({ archivePermissionsRepository })
          const actual = await sut.handle({ _archive, schema })
          expect(actual).toBeTruthy()
          expect(actual?.schema).toBe(setArchivePermissionsSchema)
          expect(actual?.allow).toBeUndefined()
          expect(actual?.reject).toBeUndefined()
        })
      })
    })
  })
})
