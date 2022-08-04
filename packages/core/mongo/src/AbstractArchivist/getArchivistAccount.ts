import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'

export const getArchivistAccount = (seed: string | undefined = process.env.ACCOUNT_SEED): XyoAccount => {
  const phrase = assertEx(seed, 'Seed phrase required to create Archivist XyoAccount')
  return new XyoAccount({ phrase })
}
