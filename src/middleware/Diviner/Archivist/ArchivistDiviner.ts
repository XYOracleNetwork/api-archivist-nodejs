import { XyoAccount } from '@xyo-network/sdk-xyo-client-js'

// TODO: Move to on chain storage (archive = public key?)
// TODO: Figure out how to inject store

export class ArchivistDiviner {
  private _account: XyoAccount
  public get account(): XyoAccount {
    return this._account
  }
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

  public addTrustedAddress(address: string): Promise<void> {
    return Promise.reject()
  }

  public isTrustedAddress(address: string): Promise<boolean> {
    return Promise.resolve(false)
  }
}
