import { XyoAccount } from '@xyo-network/account'
import {
  Logger,
  ModuleAddressPayload,
  ModuleAddressQueryPayload,
  ModuleAddressQuerySchema,
  ModuleAddressSchema,
  PayloadArchivist,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { mock, MockProxy } from 'jest-mock-extended'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBModuleAddressDiviner } from './MongoDBModuleAddressDiviner'

describe('MongoDBModuleAddressDiviner', () => {
  let logger: MockProxy<Logger>
  let account: XyoAccount
  let sdk: BaseMongoSdk<XyoPayloadWithMeta>
  let payloadsArchivist: MockProxy<PayloadArchivist>
  let sut: MongoDBModuleAddressDiviner
  beforeEach(() => {
    logger = mock<Logger>()
    account = XyoAccount.random()
    payloadsArchivist = mock<PayloadArchivist>()
    sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
    sut = new MongoDBModuleAddressDiviner(logger, account, payloadsArchivist, sdk)
  })
  describe('divine', () => {
    describe('with valid query', () => {
      it('divines', async () => {
        const query: ModuleAddressQueryPayload = { schema: ModuleAddressQuerySchema }
        const result = await sut.divine([query])
        expect(result).toBeArrayOfSize(1)
        const actual = result[0] as ModuleAddressPayload
        expect(actual).toBeObject()
        expect(actual.schema).toBe(ModuleAddressSchema)
      })
    })
  })
})
