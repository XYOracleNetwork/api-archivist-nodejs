import { ArchivistDiviner } from './ArchivistDiviner'

describe('ArchivistDiviner', () => {
  it('Creates an account', () => {
    const { account } = ArchivistDiviner.instance
    expect(account).toBeTruthy()
    expect(account.addressValue).toBeTruthy()
  })
})
