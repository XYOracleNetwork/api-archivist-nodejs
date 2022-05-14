import { ArchivistDiviner } from './ArchivistDiviner'

const address = 'foo'

describe('ArchivistDiviner', () => {
  describe('instance', () => {
    it('Creates an account', () => {
      const { account } = ArchivistDiviner.instance
      expect(account).toBeTruthy()
      expect(account.addressValue).toBeTruthy()
    })
  })
  describe('addTrustedAddress', () => {
    it('Adds teh address as a trusted address', () => {
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
