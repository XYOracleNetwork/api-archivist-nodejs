import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  Job,
  JobProvider,
  LocationCertaintyDiviner,
  LocationCertaintyHeuristic,
  LocationCertaintyPayload,
  LocationCertaintySchema,
  Logger,
  PayloadArchivist,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import {
  XyoLocationElevationSchema,
  XyoLocationElevationWitness,
  XyoLocationElevationWitnessConfigSchema,
} from '@xyo-network/elevation-payload-plugin'
import { XyoLocationPayload, XyoLocationSchema } from '@xyo-network/location-payload-plugin'
import { XyoPayloadBuilder, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBLocationCertaintyDiviner extends XyoDiviner implements LocationCertaintyDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected readonly logger: Logger,
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(TYPES.PayloadArchivist) protected readonly payloads: PayloadArchivist,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      {
        name: 'MongoDBElevationDiviner.DivineElevationBatch',
        schedule: '10 minute',
        task: async () => await this.divineElevationBatch(),
      },
    ]
  }

  /** @description Given a set of locations, get the expected elevations (witness if needed), and return score/variance */
  public async divine(payloads?: XyoPayloads): Promise<XyoPayloads<LocationCertaintyPayload>> {
    const locations = payloads?.filter<XyoLocationPayload>((payload): payload is XyoLocationPayload => payload?.schema === XyoLocationSchema)
    // If this is a query we support
    if (locations && locations?.length > 0) {
      const elevationWitness = new XyoLocationElevationWitness({
        locations,
        schema: XyoLocationElevationWitnessConfigSchema,
        targetSchema: XyoLocationElevationSchema,
      })
      const elevations = await elevationWitness.observe()

      const heuristics = elevations.reduce<{ altitude: (number | null)[]; elevation: number[]; variance: (number | null)[] }>(
        (prev, elev, index) => {
          const elevation = assertEx(elev.elevation)
          const altitude = locations[index].altitude
          prev.altitude.push(altitude ?? null)
          prev.elevation.push(elevation)
          prev.variance.push(altitude ? altitude - elevation : null)
          return prev
        },
        { altitude: [], elevation: [], variance: [] },
      )

      const calcHeuristic = (heuristic: (number | null)[]): LocationCertaintyHeuristic => {
        return {
          max: heuristic.reduce<number>((prev, value) => {
            return value ? (value > prev ? value : prev) : prev
          }, -Infinity),
          mean: (() => {
            const values = heuristic.reduce<number[]>(
              (prev, value) => {
                return value ? [value + prev[0], prev[1] + 1] : prev
              },
              [0, 0],
            )
            return values[0] / values[1]
          })(),
          min: heuristic.reduce<number>((prev, value) => {
            return value ? (value < prev ? value : prev) : prev
          }, Infinity),
        }
      }

      const result = new XyoPayloadBuilder<LocationCertaintyPayload>({ schema: LocationCertaintySchema })
        .fields({
          altitude: calcHeuristic(heuristics.altitude),
          elevation: calcHeuristic(heuristics.elevation),
          variance: calcHeuristic(heuristics.variance),
        })
        .build()

      this.logger.log('MongoDBElevationDiviner.Divine: Processed query')
      return [result]
    }
    // else return empty response
    return []
  }

  override async initialize(): Promise<void> {
    this.logger.log('MongoDBElevationDiviner.Initialize: Initializing')
    // TODO: Any async init here
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.Initialize: Initialized')
  }

  override async shutdown(): Promise<void> {
    this.logger.log('MongoDBElevationDiviner.Shutdown: Shutting down')
    // TODO: Any async shutdown
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.Shutdown: Shutdown')
  }

  private divineElevationBatch = async () => {
    this.logger.log('MongoDBElevationDiviner.DivineElevationBatch: Divining elevations for batch')
    // TODO: Any background/batch processing here
    await Promise.resolve()
    this.logger.log('MongoDBElevationDiviner.DivineElevationBatch: Divined elevations for batch')
  }
}
