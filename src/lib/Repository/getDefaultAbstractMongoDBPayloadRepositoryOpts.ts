import { XyoAccount } from '@xyo-network/account'

import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'
import { AbstractMongoDBPayloadRepositoryOpts } from './AbstractMongoDBPayloadRepositoryOpts'

export const getDefaultAbstractMongoDBPayloadRepositoryOpts = (): AbstractMongoDBPayloadRepositoryOpts => {
  return {
    account: XyoAccount.random(),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}
