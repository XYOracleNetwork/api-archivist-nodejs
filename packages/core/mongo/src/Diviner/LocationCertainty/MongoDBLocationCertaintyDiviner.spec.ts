import { XyoAccount } from '@xyo-network/account'
import { LocationCertaintyPayload, LocationCertaintySchema, Logger, PayloadArchivist, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { XyoLocationPayload, XyoLocationSchema } from '@xyo-network/location-payload-plugin'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock, MockProxy } from 'jest-mock-extended'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBLocationCertaintyDiviner } from './MongoDBLocationCertaintyDiviner'

describe('MongoDBLocationCertaintyDiviner', () => {
  let logger: MockProxy<Logger>
  let account: XyoAccount
  let sdk: BaseMongoSdk<XyoPayloadWithMeta>
  let payloadsArchivist: MockProxy<PayloadArchivist>
  let sut: MongoDBLocationCertaintyDiviner
  beforeEach(() => {
    logger = mock<Logger>()
    account = XyoAccount.random()
    payloadsArchivist = mock<PayloadArchivist>()
    sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
    sut = new MongoDBLocationCertaintyDiviner(logger, account, payloadsArchivist, sdk)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const noLocations: XyoLocationPayload[] = []
        const noLocationsResult = await sut.divine(noLocations)
        expect(noLocationsResult).toBeArrayOfSize(0)
        const locations: XyoLocationPayload[] = [
          { altitude: 5, quadkey: '0203', schema: XyoLocationSchema },
          { altitude: 300, quadkey: '0102', schema: XyoLocationSchema },
        ]
        const locationsResult = await sut.divine(locations)
        expect(locationsResult).toBeArrayOfSize(1)
        const actual = locationsResult[0] as LocationCertaintyPayload
        console.log(`locationsResult: ${JSON.stringify(locationsResult, null, 2)}`)
        expect(actual).toBeObject()
        expect(actual.schema).toBe(LocationCertaintySchema)
      })
    })
  })
})
