import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/sdk-xyo-client-js'

export const getAccountFromSeedPhrase = (seed?: string) => {
  const phrase = assertEx(seed, 'Seed phrase required to create Archivist XyoAccount')
  return new XyoAccount({ phrase })
}
