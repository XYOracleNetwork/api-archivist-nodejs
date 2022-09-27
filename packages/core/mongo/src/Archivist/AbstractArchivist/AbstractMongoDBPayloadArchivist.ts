import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  AbstractPayloadArchivist,
  XyoBoundWitnessWithMeta,
  XyoPayloadFilterPredicate,
  XyoPayloadWithMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { BoundWitnessBuilder, BoundWitnessBuilderConfig, XyoBoundWitness } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { XyoPayloadBuilder } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable, named } from 'inversify'
import { ExplainVerbosity, Filter, OptionalUnlessRequiredId, WithoutId } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

const builderConfig: BoundWitnessBuilderConfig = { inlinePayloads: false }

@injectable()
export abstract class AbstractMongoDBPayloadArchivist<
  T extends EmptyObject = EmptyObject,
  TId extends string = string,
> extends AbstractPayloadArchivist<T, TId> {
  public constructor(
    @inject(TYPES.Account) @named('root') protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly payloads: BaseMongoSdk<XyoPayloadWithMeta<T>>,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly boundWitnesses: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super(account)
  }

  public abstract get schema(): string

  async _findWitnessPlan(_archive: string) {
    return (await this.findWitnessQuery(_archive)).explain(ExplainVerbosity.allPlansExecution)
  }

  find(_filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]> {
    throw new Error('AbstractMongoDBPayloadArchivist: Find not implemented')
  }

  async get(ids: TId[]): Promise<Array<XyoPayloadWithMeta<T>>> {
    assertEx(ids.length === 1, 'Retrieval of multiple payloads not supported')
    const _archive = assertEx(ids.pop(), 'Missing archive')
    const boundWitnesses = await (await this.findWitnessQuery(_archive)).toArray()
    const lastWitness = boundWitnesses.pop()
    if (!lastWitness) return []
    const witnessedPayloadIndex = lastWitness.payload_schemas.findIndex((s) => s === this.schema)
    assertEx(witnessedPayloadIndex > -1, `AbstractMongoDBPayloadArchivist: Invalid permissions index in BoundWitness (${lastWitness._hash})`)
    const _hash = assertEx(
      lastWitness.payload_hashes[witnessedPayloadIndex],
      `AbstractMongoDBPayloadArchivist: Missing permissions payload hash in BoundWitness (${lastWitness._hash})`,
    )
    const payloadFilter = { _archive, _hash, schema: this.schema } as Filter<XyoPayloadWithMeta<T>>
    const payload = removeId(
      assertEx(
        await this.payloads.findOne(payloadFilter),
        `AbstractMongoDBPayloadArchivist: Missing Payload (${_hash}) from BoundWitness (${lastWitness._hash})`,
      ),
    ) as XyoPayloadWithMeta<T>
    return [payload]
  }

  async insert(items: XyoPayloadWithPartialMeta<WithoutId<T>>[]): Promise<XyoBoundWitness | null> {
    const _timestamp = Date.now()
    const payloads = items.map((p) => {
      return {
        ...new XyoPayloadBuilder({ schema: this.schema }).fields(p).build(),
        _archive: assertEx((p as XyoPayloadWithPartialMeta)?._archive, 'No archive supplied for SetArchivePermissionsPayload'),
        _timestamp,
      } as OptionalUnlessRequiredId<XyoPayloadWithMeta<T>>
    })
    const boundWitnesses: XyoBoundWitnessWithMeta[] = payloads.map((p) => {
      const bw = new BoundWitnessBuilder(builderConfig).witness(this.account).payload(p).build()
      const _archive = p._archive
      return { ...bw, _archive, _timestamp } as XyoBoundWitnessWithMeta
    })
    const payloadsResults = await this.payloads.insertMany(payloads)
    if (!payloadsResults.acknowledged || payloadsResults.insertedCount !== payloads.length)
      throw new Error('AbstractMongoDBPayloadArchivist: Error inserting Payloads')

    const witnessResults = await this.boundWitnesses.insertMany(boundWitnesses)
    if (!witnessResults.acknowledged || witnessResults.insertedCount !== boundWitnesses.length)
      throw new Error('AbstractMongoDBPayloadArchivist: Error inserting BoundWitnesses')

    const [bw] = await this.bindPayloads(items)
    return bw
  }

  private async findWitnessQuery(_archive: string) {
    const addresses: string = assertEx(
      this.account.addressValue.bn.toString('hex'),
      'AbstractMongoDBPayloadArchivist: Invalid signing account address',
    )
    const filter: Filter<XyoBoundWitnessWithMeta> = { _archive, addresses, payload_schemas: this.schema }
    return (await this.boundWitnesses.find(filter)).sort({ _timestamp: -1 }).limit(1)
  }
}
