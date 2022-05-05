import { XyoPayload, XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
// eslint-disable-next-line import/no-named-as-default
import Ajv from 'ajv'

import { GetValidator } from './GetValidator'

const ajv = new Ajv()

export const getPayloadValidatorFromSchemaCache: GetValidator<XyoPayload> = async (payload) => {
  // TODO: Ensure the ajv cached version reflects the schema cached version?
  const validate = ajv.getSchema(payload.schema)
  if (!validate) {
    const schema = await XyoSchemaCache.instance.get(payload.schema)
    if (!schema) {
      return undefined
    }
    ajv.addSchema(schema, payload.schema)
    return ajv.getSchema(payload.schema)
  }
}
