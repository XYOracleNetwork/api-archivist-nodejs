import { XyoPayload, XyoPayloadWithPartialMeta, XyoPayloadWrapper, XyoSchemaCache, XyoSchemaPayload } from '@xyo-network/sdk-xyo-client-js'
// eslint-disable-next-line import/no-named-as-default
import Ajv from 'ajv'

import { GetValidator } from '../../model'

const ajv = new Ajv()

export const getPayloadValidatorFromSchemaCache: GetValidator<XyoPayload> = async (payload) => {
  // Get the schema from the schema cache
  const schemaPayload: XyoPayloadWithPartialMeta<XyoSchemaPayload> | undefined = (await XyoSchemaCache.instance.get(payload.schema))?.payload
  // If it doesn't exist return undefined
  if (!schemaPayload) return undefined
  const { definition, _hash } = schemaPayload
  // Use the schema cache payload hash as the AJV cache key to memoize
  // the AJV validator
  const key = _hash || new XyoPayloadWrapper(schemaPayload).hash
  // Check if we already cached the validator
  const validate = ajv.getSchema(key)
  // Return the cached validator for this schema
  if (validate) return validate
  // Otherwise, compile it now
  ajv.addSchema(definition, key)
  // and return it
  return ajv.getSchema(key)
}
