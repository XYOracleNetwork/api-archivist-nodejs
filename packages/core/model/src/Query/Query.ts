import { XyoAccount } from '@xyo-network/account'
import { XyoPayload, XyoPayloadWithPartialMeta } from '@xyo-network/payload'

export abstract class Query<T extends XyoPayload = XyoPayload> {
  protected account: XyoAccount = XyoAccount.random()

  constructor(public readonly payload: XyoPayloadWithPartialMeta<T>) {}
  /**
   * The unique ID for the query. Since we use a different
   * account for each query, we use the public address of the
   * account as a correlation ID for the query.
   * @returns Unique ID for the query
   */
  public get id(): string {
    return `${this.account.addressValue.bn.toString('hex')}`
  }
}
