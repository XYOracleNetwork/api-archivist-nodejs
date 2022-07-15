import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../dbSdk'
import { getArchivistAccount } from '../getArchivistAccount'
import { AbstractMongoDBPayloadArchivistOpts } from './AbstractMongoDBPayloadRepositoryOpts'

export const getDefaultAbstractMongoDBPayloadArchivistOpts = (): AbstractMongoDBPayloadArchivistOpts => {
  return {
    account: getArchivistAccount(),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}
