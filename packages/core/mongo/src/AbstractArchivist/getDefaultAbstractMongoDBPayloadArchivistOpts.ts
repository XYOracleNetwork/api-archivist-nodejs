import { getArchivistAllBoundWitnessesMongoSdk, getArchivistAllPayloadMongoSdk } from '../Mongo'
import { AbstractMongoDBPayloadArchivistOpts } from './AbstractMongoDBPayloadArchivistOpts'
import { getArchivistAccount } from './getArchivistAccount'

export const getDefaultAbstractMongoDBPayloadArchivistOpts = (): AbstractMongoDBPayloadArchivistOpts => {
  return {
    // TODO: Get via DI
    account: getArchivistAccount(),
    boundWitnessSdk: getArchivistAllBoundWitnessesMongoSdk(),
    config: { inlinePayloads: false },
    payloadsSdk: getArchivistAllPayloadMongoSdk(),
  }
}
