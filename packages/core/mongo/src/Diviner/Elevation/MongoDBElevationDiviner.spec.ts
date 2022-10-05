import { XyoAccount } from '@xyo-network/account'
import { ElevationPayload, ElevationSchema, Logger, PayloadArchivist, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { XyoLocationPayload } from '@xyo-network/location-payload-plugin'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock, MockProxy } from 'jest-mock-extended'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBElevationDiviner } from './MongoDBElevationDiviner'

describe('MongoDBElevationDiviner', () => {
  let logger: MockProxy<Logger>
  let account: XyoAccount
  let sdk: BaseMongoSdk<XyoPayloadWithMeta>
  let payloadsArchivist: MockProxy<PayloadArchivist>
  let sut: MongoDBElevationDiviner
  beforeEach(() => {
    logger = mock<Logger>()
    account = XyoAccount.random()
    payloadsArchivist = mock<PayloadArchivist>()
    sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
    sut = new MongoDBElevationDiviner(logger, account, payloadsArchivist, sdk)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const locations: XyoLocationPayload[] = []
        const result = await sut.divine(locations)
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as ElevationPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(ElevationSchema)
      })
    })
  })
})
