import { XyoAccount } from '@xyo-network/sdk-xyo-client-js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      account: XyoAccount
    }
  }
}

export * from './getAccountFromSeedPhrase'
