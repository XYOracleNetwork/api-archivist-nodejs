import { getAccountFromSeedPhrase } from '../../middleware'
import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'
import { AbstractMongoDBPayloadRepositoryOpts } from './AbstractMongoDBPayloadRepositoryOpts'

export const getDefaultAbstractMongoDBPayloadRepositoryOpts = (): AbstractMongoDBPayloadRepositoryOpts => {
  return {
    account: getAccountFromSeedPhrase(process.env.ACCOUNT_SEED),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}
