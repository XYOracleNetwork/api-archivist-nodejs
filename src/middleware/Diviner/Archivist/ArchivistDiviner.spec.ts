import { ArchivistDiviner } from './ArchivistDiviner'

const address = 'foo'

describe('ArchivistDiviner', () => {
  describe('addressValue', () => {
    it('Exposes the address associated with the signing account', () => {
      const { addressValue } = ArchivistDiviner.instance
      expect(addressValue).toBeTruthy()
    })
  })
  describe('addTrustedAddress', () => {
    it('Adds the address as a trusted address', () => {
      expect(ArchivistDiviner.instance.addTrustedAddress(address)).toBeTruthy()
    })
  })
  describe('isTrustedAddress', () => {
    describe('when address is trusted', () => {
      it('returns true', () => {
        expect(ArchivistDiviner.instance.isTrustedAddress(address)).toBeTruthy()
      })
    })
    describe('when address is not trusted', () => {
      it('returns false', () => {
        expect(ArchivistDiviner.instance.isTrustedAddress(address)).toBeFalsy()
      })
    })
  })
})
