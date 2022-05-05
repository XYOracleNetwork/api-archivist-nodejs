import { XyoPayload, XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
// eslint-disable-next-line import/no-named-as-default
import Ajv, { ValidateFunction } from 'ajv'

const ajv = new Ajv()

export const getValidatorForPayload = async (payload: XyoPayload): Promise<ValidateFunction | undefined> => {
  const validate = ajv.getSchema(payload.schema)
  if (!validate) {
    const schema = await XyoSchemaCache.instance.get(payload.schema)
    if (!schema) {
      return undefined
    }
    ajv.addSchema(schema, payload.schema)
    return ajv.getSchema('user')
  }
}
