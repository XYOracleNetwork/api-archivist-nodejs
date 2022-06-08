import { mock, MockProxy } from 'jest-mock-extended'

import { ArchivePermissionsRepository } from '../middleware'
import { debugSchema, SetArchivePermissionsPayload, SetArchivePermissionsQuery, setArchivePermissionsSchema } from '../model'
import { SetArchivePermissionsQueryHandler } from './SetArchivePermissionsQueryHandler'

const _archive = 'test'
const permissions: SetArchivePermissionsPayload = {
  allow: {
    addresses: ['0x8ba1f109551bd432803012645ac136ddd64dba72'],
    schemas: ['network.xyo.test'],
  },
  reject: {
    addresses: ['0x0ac1df02185025f65202660f8167210a80dd5086'],
    schemas: [debugSchema],
  },
  schema: setArchivePermissionsSchema,
}

describe('SetArchivePermissionsQueryHandler', () => {
  describe('handle', () => {
    let archivePermissionsRepository: MockProxy<ArchivePermissionsRepository>
    beforeEach(() => {
      archivePermissionsRepository = mock<ArchivePermissionsRepository>()
      archivePermissionsRepository.get.mockResolvedValue([permissions])
      archivePermissionsRepository.insert.mockResolvedValue([permissions])
    })
    it('sets the permissions for the archive', async () => {
      const sut = new SetArchivePermissionsQueryHandler({ archivePermissionsRepository })
      await sut.handle(new SetArchivePermissionsQuery({ _archive, ...permissions }))
    })
  })
})
