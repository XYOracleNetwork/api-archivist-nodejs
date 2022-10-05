import { XyoAccount } from '@xyo-network/account'
import { BoundWitnessArchivist, Logger, PayloadArchivist, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { XyoLocationSchema } from '@xyo-network/location-payload-plugin'
import { XyoPayload } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock, MockProxy } from 'jest-mock-extended'

import { COLLECTIONS } from '../../../collections'
import { getBaseMongoSdk } from '../../../Mongo'
import { CoinCurrentUserWitnessPayload, CoinCurrentUserWitnessSchema, CoinUserLocationsDiviner } from './UserLocationsDiviner'

describe('CoinUserLocationsDiviner', () => {
  let logger: MockProxy<Logger>
  let account: XyoAccount
  let sdk: BaseMongoSdk<XyoPayloadWithMeta>
  let payloadsArchivist: MockProxy<PayloadArchivist>
  let bwArchivist: MockProxy<BoundWitnessArchivist>
  let sut: CoinUserLocationsDiviner
  beforeEach(() => {
    logger = mock<Logger>()
    account = XyoAccount.random()
    payloadsArchivist = mock<PayloadArchivist>()
    bwArchivist = mock<BoundWitnessArchivist>()
    sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
    sut = new CoinUserLocationsDiviner(logger, account, payloadsArchivist, bwArchivist, sdk)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: CoinCurrentUserWitnessPayload = { schema: CoinCurrentUserWitnessSchema, uid: 'test' }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(0)
        const actual = result[0] as XyoPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(XyoLocationSchema)
      })
    })
  })
})
