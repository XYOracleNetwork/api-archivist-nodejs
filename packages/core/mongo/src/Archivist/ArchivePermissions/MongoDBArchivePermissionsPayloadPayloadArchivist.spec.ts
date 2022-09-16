import { XyoAccount } from '@xyo-network/account'
import { SetArchivePermissionsPayload, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBArchivePermissionsPayloadPayloadArchivist } from './MongoDBArchivePermissionsPayloadArchivist'

describe('MongoDBArchivePermissionsPayloadPayloadArchivist', () => {
  const phrase = process.env.ACCOUNT_SEED
  const account = new XyoAccount({ phrase })
  describe('get', () => {
    describe('with public archive', () => {
      it('returns no permissions for the archive', async () => {
        const payloads: BaseMongoSdk<XyoPayloadWithMeta<SetArchivePermissionsPayload>> = getBaseMongoSdk<
          XyoPayloadWithMeta<SetArchivePermissionsPayload>
        >(COLLECTIONS.Payloads)
        const boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta> = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
        const sut = new MongoDBArchivePermissionsPayloadPayloadArchivist(account, payloads, boundWitnesses)
        const result = await sut.get(['temp'])
        expect(result).toBeArray()
        expect(result.length).toBe(0)
      })
      it('uses an index to perform the BoundWitness query', async () => {
        const payloads: BaseMongoSdk<XyoPayloadWithMeta<SetArchivePermissionsPayload>> = getBaseMongoSdk<
          XyoPayloadWithMeta<SetArchivePermissionsPayload>
        >(COLLECTIONS.Payloads)
        const boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta> = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
        const sut = new MongoDBArchivePermissionsPayloadPayloadArchivist(account, payloads, boundWitnesses)
        const plan = await sut._findWitnessPlan('temp-private')
        expect(plan?.queryPlanner?.winningPlan?.inputStage?.inputStage?.stage).toBe('IXSCAN')
        expect(plan?.executionStats?.nReturned).toBeLessThanOrEqual(1)
        expect(plan?.executionStats?.totalDocsExamined).toBeLessThanOrEqual(1)
        expect(plan?.executionStats?.totalKeysExamined).toBeLessThanOrEqual(1)
      })
    })
    describe('with private archive', () => {
      it('returns permissions for the archive', async () => {
        const payloads: BaseMongoSdk<XyoPayloadWithMeta<SetArchivePermissionsPayload>> = getBaseMongoSdk<
          XyoPayloadWithMeta<SetArchivePermissionsPayload>
        >(COLLECTIONS.Payloads)
        const boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta> = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
        const sut = new MongoDBArchivePermissionsPayloadPayloadArchivist(account, payloads, boundWitnesses)
        const result = await sut.get(['temp-private'])
        expect(result).toBeArray()
        expect(result.length).toBe(1)
        const permissions = result?.[0]
        expect(permissions).toBeObject()
      })
      it('uses an index to perform the BoundWitness query', async () => {
        const payloads: BaseMongoSdk<XyoPayloadWithMeta<SetArchivePermissionsPayload>> = getBaseMongoSdk<
          XyoPayloadWithMeta<SetArchivePermissionsPayload>
        >(COLLECTIONS.Payloads)
        const boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta> = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
        const sut = new MongoDBArchivePermissionsPayloadPayloadArchivist(account, payloads, boundWitnesses)
        const plan = await sut._findWitnessPlan('temp-private')
        expect(plan?.queryPlanner?.winningPlan?.inputStage?.inputStage?.stage).toBe('IXSCAN')
        expect(plan?.executionStats?.nReturned).toBeLessThanOrEqual(1)
        expect(plan?.executionStats?.totalDocsExamined).toBeLessThanOrEqual(1)
        expect(plan?.executionStats?.totalKeysExamined).toBeLessThanOrEqual(1)
      })
    })
  })
})
