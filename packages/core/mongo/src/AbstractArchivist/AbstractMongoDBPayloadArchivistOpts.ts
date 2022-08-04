import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilderConfig, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

export interface AbstractMongoDBPayloadArchivistOpts {
  account: XyoAccount
  boundWitnessSdk: BaseMongoSdk<XyoBoundWitness>
  config: XyoBoundWitnessBuilderConfig
  payloadsSdk: BaseMongoSdk<XyoPayload>
}
