import { ArchivistDiviner } from './ArchivistDiviner'

const address = 'foo'

describe('ArchivistDiviner', () => {
  beforeAll(async () => {
    await ArchivistDiviner.instance.addTrustedAddress(address)
  })
  describe('addressValue', () => {
    it('exposes the address associated with the signing account', () => {
      const { addressValue } = ArchivistDiviner.instance
      expect(addressValue).toBeTruthy()
    })
  })
  describe('addTrustedAddress', () => {
    it('adds the address as a trusted address', async () => {
      expect(await ArchivistDiviner.instance.addTrustedAddress(address)).toBe(address)
    })
    it('can add the same address multiple times', async () => {
      expect(await ArchivistDiviner.instance.addTrustedAddress(address)).toBe(address)
      expect(await ArchivistDiviner.instance.addTrustedAddress(address)).toBe(address)
    })
  })
  describe('isTrustedAddress', () => {
    describe('when address is trusted', () => {
      it('returns true', async () => {
        expect(await ArchivistDiviner.instance.isTrustedAddress(address)).toBeTruthy()
      })
    })
    describe('when address is not trusted', () => {
      it('returns false', async () => {
        expect(await ArchivistDiviner.instance.isTrustedAddress('bar')).toBeFalsy()
      })
    })
  })
})
