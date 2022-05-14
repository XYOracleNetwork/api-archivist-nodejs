import { XyoAccount, XyoAddressValue } from '@xyo-network/sdk-xyo-client-js'

export class ArchivistDiviner {
  // TODO: Move to on chain storage (archive = public key?)
  private static trustedAddresses: Set<string> = new Set<string>()

  private _account: XyoAccount
  public get addressValue(): XyoAddressValue {
    return this._account.addressValue
  }

  // TODO: Inject on chain repository
  private constructor(protected readonly privateKey = process.env.SIGNING_KEY_PRIVATE) {
    this._account = new XyoAccount({ privateKey: this.privateKey })
  }

  private static _instance?: ArchivistDiviner
  public static get instance() {
    if (!this._instance) {
      this._instance = new ArchivistDiviner()
    }
    return this._instance
  }

  public addTrustedAddress(address: string): Promise<string> {
    ArchivistDiviner.trustedAddresses.add(address)
    return Promise.resolve(address)
  }

  public isTrustedAddress(address: string): Promise<boolean> {
    const contains = ArchivistDiviner.trustedAddresses.has(address)
    return Promise.resolve(!!contains)
  }
}
