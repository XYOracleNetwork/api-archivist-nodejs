import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'
import { getArchivistAccount } from '../getArchivistAccount'
import { AbstractMongoDBPayloadRepositoryOpts } from './AbstractMongoDBPayloadRepositoryOpts'

export const getDefaultAbstractMongoDBPayloadRepositoryOpts = (): AbstractMongoDBPayloadRepositoryOpts => {
  return {
    account: getArchivistAccount(),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}
