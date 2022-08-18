import { exists } from '@xylabs/sdk-js'
import { getArchivistBoundWitnessesMongoSdk } from '@xyo-network/archivist-lib'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { XyoBoundWitnessBuilder, XyoPayloadBuilder, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

import { getAccount } from './getAccount'
import { getAllCachedSchema } from './getAllCachedSchema'

const schema = 'network.xyo.schema.cache.witness'

export const witnessCurrentSchemaInArchive = async (archive: string) => {
  const schemas = await getAllCachedSchema()
  const hashes = schemas
    .map((schema) => {
      const schemaWithMeta = schema.payload as XyoPayloadWithMeta<XyoSchemaPayload>
      return schemaWithMeta._hash
    })
    .filter(exists)
  const body = { schemas: hashes }
  const payload = new XyoPayloadBuilder({ schema }).fields(body).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(getAccount()).payload(payload).build()
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.insert(bw)
}
