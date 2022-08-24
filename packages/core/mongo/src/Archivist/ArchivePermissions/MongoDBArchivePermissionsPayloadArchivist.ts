import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { SetArchivePermissionsPayload, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '@xyo-network/archivist-model'
import { XyoBoundWitnessBuilder, XyoBoundWitnessWithMeta, XyoPayloadFindFilter, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Filter } from 'mongodb'

import { AbstractMongoDBPayloadArchivist } from '../../AbstractArchivist'
import { removeId } from '../../Mongo'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

export class MongoDBArchivePermissionsPayloadPayloadArchivist extends AbstractMongoDBPayloadArchivist<SetArchivePermissionsPayload> {
  find(_filter: XyoPayloadFindFilter): Promise<XyoPayloadWithMeta<SetArchivePermissionsPayload>[]> {
    throw new Error('Not Implemented')
  }
  async get(_archive: string): Promise<XyoPayloadWithMeta<SetArchivePermissionsPayload>[]> {
    const addresses: string = assertEx(
      this.account.addressValue.bn.toString('hex'),
      'MongoDBArchivePermissionsPayloadPayloadArchivist: Invalid signing account address',
    )
    const filter: Filter<XyoBoundWitnessWithMeta> = { _archive, addresses, payload_schemas: schema }
    const boundWitnesses = await (await this.boundWitnesses.find(filter)).sort({ _timestamp: -1 }).limit(1).toArray()
    const lastWitnessedPermissions = boundWitnesses.pop()
    if (!lastWitnessedPermissions) return []
    const permissionsPayloadIndex = lastWitnessedPermissions.payload_schemas.findIndex((s) => s === schema)
    assertEx(
      permissionsPayloadIndex > -1,
      `MongoDBArchivePermissionsPayloadPayloadArchivist: Invalid permissions index in BoundWitness (${lastWitnessedPermissions._hash})`,
    )
    const _hash = assertEx(
      lastWitnessedPermissions.payload_hashes[permissionsPayloadIndex],
      `MongoDBArchivePermissionsPayloadPayloadArchivist: Missing permissions payload hash in BoundWitness (${lastWitnessedPermissions._hash})`,
    )
    const permissions = assertEx(
      await this.payloads.findOne({ _archive, _hash, schema }),
      `MongoDBArchivePermissionsPayloadPayloadArchivist: Missing Payload (${_hash}) from BoundWitness (${lastWitnessedPermissions._hash})`,
    )
    return [permissions]
  }
  async insert(items: XyoPayloadWithMeta<SetArchivePermissionsPayload>[]): Promise<XyoPayloadWithMeta<SetArchivePermissionsPayload>[]> {
    const _timestamp = Date.now()
    const payloads: XyoPayloadWithMeta<SetArchivePermissionsPayload>[] = items.map((p) => {
      return { ...removeId(p), _archive: assertEx(p._archive, 'No archive supplied for SetArchivePermissionsPayload'), _timestamp }
    })
    const boundWitnesses: XyoBoundWitnessWithMeta[] = payloads.map((p) => {
      const bw = new XyoBoundWitnessBuilder(this.config).witness(this.account).payload(p).build()
      const _archive = p._archive
      return { ...bw, _archive, _timestamp }
    })

    const payloadsResults = await this.payloads.insertMany(payloads)
    if (!payloadsResults.acknowledged || payloadsResults.insertedCount !== payloads.length)
      throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting Payloads')

    const witnessResults = await this.boundWitnesses.insertMany(boundWitnesses)
    if (!witnessResults.acknowledged || witnessResults.insertedCount !== boundWitnesses.length)
      throw new Error('MongoDBArchivePermissionsPayloadPayloadArchivist: Error inserting BoundWitnesses')

    return items
  }
}
