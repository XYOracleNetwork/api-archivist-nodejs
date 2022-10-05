import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import { BoundWitnessesArchivist, Job, JobProvider, Logger, PayloadArchivist, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoLocationPayload, XyoLocationSchema } from '@xyo-network/location-payload-plugin'
import { PayloadWrapper, XyoPayload, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import compact from 'lodash/compact'

import { MONGO_TYPES } from '../../../types'

export type CoinCurrentUserWitnessSchema = 'co.coinapp.current.user.witness'
export const CoinCurrentUserWitnessSchema: CoinCurrentUserWitnessSchema = 'co.coinapp.current.user.witness'

export type CoinCurrentUserWitnessPayload = XyoPayload<{
  balance?: number
  daysOld?: number
  deviceId?: string
  geomines?: number
  planType?: string
  schema: CoinCurrentUserWitnessSchema
  uid: string
}>

export type CoinCurrentLocationWitnessSchema = 'co.coinapp.current.location.witness'
export const CoinCurrentLocationWitnessSchema: CoinCurrentLocationWitnessSchema = 'co.coinapp.current.location.witness'

export type CoinCurrentLocationWitnessPayload = XyoPayload<{
  altitudeMeters: number
  directionDegrees: number
  latitude: number
  quadkey: string
  schema: CoinCurrentLocationWitnessSchema
  speedKph: number
}>

export const isLocationPayload = (x?: XyoPayload | null): x is XyoLocationPayload => x?.schema === XyoLocationSchema

@injectable()
export class CoinUserLocationsDiviner extends XyoDiviner implements CoinUserLocationsDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected readonly logger: Logger,
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.PayloadArchivist) protected readonly payloads: PayloadArchivist,
    @inject(TYPES.BoundWitnessArchivist) protected readonly bws: BoundWitnessesArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'CoinUserLocationsDiviner.DivineUserLocationsBatch',
        schedule: '10 minute',
        task: async () => await this.divineUserLocationsBatch(),
      },
    ]
  }

  public async divine(payloads?: XyoPayloads): Promise<XyoPayloads<XyoLocationPayload>> {
    const user = payloads?.find<CoinCurrentUserWitnessPayload>(
      (payload): payload is CoinCurrentUserWitnessPayload => payload?.schema === CoinCurrentUserWitnessSchema,
    )
    // If this is a query we support
    if (user) {
      const wrapper = new PayloadWrapper(user)
      // TODO: Extract relevant query values here
      this.logger.log('CoinUserLocationsDiviner.Divine: Processing query')
      // Simulating work
      const bwList = (await this.bws.find({ payload_hashes: [wrapper.hash] })) ?? []
      const locationHashes = bwList
        .map((bw) => {
          const locations: string[] = []
          for (let i = 0; i < bwList.length; i++) {
            if (bw?.payload_schemas[i] === CoinCurrentLocationWitnessSchema) {
              locations.push(assertEx(bw?.payload_hashes[i], 'Missing hash'))
            }
          }
          return locations
        })
        .flat()
      const locations = compact(await this.payloads.get(locationHashes)) as unknown as XyoLocationPayload[]
      this.logger.log('CoinUserLocationsDiviner.Divine: Processed query')
      return locations
    }
    // else return empty response
    return []
  }

  override async initialize(): Promise<void> {
    this.logger.log('CoinUserLocationsDiviner.Initialize: Initializing')
    // TODO: Any async init here
    await Promise.resolve()
    this.logger.log('CoinUserLocationsDiviner.Initialize: Initialized')
  }

  override async shutdown(): Promise<void> {
    this.logger.log('CoinUserLocationsDiviner.Shutdown: Shutting down')
    // TODO: Any async shutdown
    await Promise.resolve()
    this.logger.log('CoinUserLocationsDiviner.Shutdown: Shutdown')
  }

  private divineUserLocationsBatch = async () => {
    this.logger.log('CoinUserLocationsDiviner.DivineUserLocationsBatch: Divining user locations for batch')
    // TODO: Any background/batch processing here
    await Promise.resolve()
    this.logger.log('CoinUserLocationsDiviner.DivineUserLocationsBatch: Divined user locations for batch')
  }
}
