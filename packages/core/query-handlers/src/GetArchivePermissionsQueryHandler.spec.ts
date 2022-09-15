import {
  ArchivePermissionsArchivist,
  DebugSchema,
  GetArchivePermissionsQuery,
  GetArchivePermissionsSchema,
  SetArchivePermissionsPayload,
  SetArchivePermissionsSchema,
} from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { mock, MockProxy } from 'jest-mock-extended'

import { GetArchivePermissionsQueryHandler } from './GetArchivePermissionsQueryHandler'

const schema = GetArchivePermissionsSchema
const _archive = 'test'
const _hash = '1234567890'
const _timestamp = Date.now()
const emptyPermissions: SetArchivePermissionsPayload = {
  schema: 'network.xyo.security.archive.permissions.set',
}
const permissions: SetArchivePermissionsPayload = {
  addresses: {
    allow: ['0x8ba1f109551bd432803012645ac136ddd64dba72'],
    reject: ['0x0ac1df02185025f65202660f8167210a80dd5086'],
  },
  schema: SetArchivePermissionsSchema,
  schemas: {
    allow: ['network.xyo.test'],
    reject: [DebugSchema],
  },
}

const expectEmptyPermissions = (actual: XyoPayloadWithMeta<SetArchivePermissionsPayload>) => {
  expect(actual).toBeTruthy()
  expect(actual?.schema).toBe(SetArchivePermissionsSchema)
  expect(actual?.addresses).toBeUndefined()
  expect(actual?.schemas).toBeUndefined()
}

describe('GetArchivePermissionsQueryHandler', () => {
  describe('handle', () => {
    let archivist: MockProxy<ArchivePermissionsArchivist>
    describe('when permissions for the archive', () => {
      describe('exist', () => {
        beforeEach(() => {
          archivist = mock<ArchivePermissionsArchivist>()
          archivist.get.mockResolvedValue([permissions, emptyPermissions])
          archivist.find.mockResolvedValue([permissions, emptyPermissions])
        })
        it('returns the latest archive permissions', async () => {
          const sut = new GetArchivePermissionsQueryHandler(archivist)
          const actual = await sut.handle(new GetArchivePermissionsQuery({ _archive, _hash, _timestamp, schema }))
          expect(actual).toBeTruthy()
          expect(actual?.schema).toBe(SetArchivePermissionsSchema)
          expect(actual?.addresses).toBeDefined()
          expect(actual?.addresses?.allow).toBeDefined()
          expect(Array.isArray(actual?.addresses?.allow)).toBeTruthy()
          expect(actual?.addresses?.reject).toBeDefined()
          expect(Array.isArray(actual?.addresses?.reject)).toBeTruthy()
          expect(actual?.schemas).toBeDefined()
          expect(actual?.schemas?.allow).toBeDefined()
          expect(Array.isArray(actual?.schemas?.allow)).toBeTruthy()
          expect(actual?.schemas?.reject).toBeDefined()
          expect(Array.isArray(actual?.schemas?.reject)).toBeTruthy()
        })
      })
    })
    describe('do not exist', () => {
      beforeEach(() => {
        archivist = mock<ArchivePermissionsArchivist>()
        archivist.get.mockResolvedValue([])
        archivist.find.mockResolvedValue([])
      })
      it('returns the empty permissions', async () => {
        const sut = new GetArchivePermissionsQueryHandler(archivist)
        const actual = await sut.handle(new GetArchivePermissionsQuery({ _archive, _hash, _timestamp, schema }))
        expectEmptyPermissions(actual)
      })
    })
    describe('when archive not supplied', () => {
      beforeEach(() => {
        archivist = mock<ArchivePermissionsArchivist>()
        archivist.get.mockResolvedValue([])
        archivist.find.mockResolvedValue([])
      })
      it('returns the empty permissions', async () => {
        const sut = new GetArchivePermissionsQueryHandler(archivist)
        const actual = await sut.handle(new GetArchivePermissionsQuery({ _hash, _timestamp, schema }))
        expectEmptyPermissions(actual)
      })
    })
    describe('when no archive supplied', () => {
      beforeEach(() => {
        archivist = mock<ArchivePermissionsArchivist>()
        archivist.get.mockResolvedValue([])
        archivist.find.mockResolvedValue([])
      })
      it('returns the empty permissions', async () => {
        const sut = new GetArchivePermissionsQueryHandler(archivist)
        const actual = await sut.handle(new GetArchivePermissionsQuery({ _archive, _hash, _timestamp, schema }))
        expect(actual).toBeTruthy()
        expect(actual?.schema).toBe(SetArchivePermissionsSchema)
        expect(actual?.addresses).toBeUndefined()
        expect(actual?.schemas).toBeUndefined()
      })
    })
  })
})
