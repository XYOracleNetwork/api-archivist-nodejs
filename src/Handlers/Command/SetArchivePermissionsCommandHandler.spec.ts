import { mock, MockProxy } from 'jest-mock-extended'

import { ArchivePermissionsRepository } from '../../middleware'
import { SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../../model'
import { SetArchivePermissionsCommandHandler } from './SetArchivePermissionsCommandHandler'

const _archive = 'test'
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

describe('SetArchivePermissionsCommandHandler', () => {
  describe('handle', () => {
    let archivePermissionsRepository: MockProxy<ArchivePermissionsRepository>
    beforeEach(() => {
      archivePermissionsRepository = mock<ArchivePermissionsRepository>()
      archivePermissionsRepository.insert.mockResolvedValue([permissions])
    })
    it('sets the permissions for the archive', async () => {
      const sut = new SetArchivePermissionsCommandHandler({ archivePermissionsRepository })
      await sut.handle({ _archive, ...permissions })
    })
  })
})
