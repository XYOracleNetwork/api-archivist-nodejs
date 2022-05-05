import { XyoPayload, XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'
// eslint-disable-next-line import/no-named-as-default
import Ajv, { ValidateFunction } from 'ajv'

const ajv = new Ajv()

const getValidatorForPayload = async (payload: XyoPayload): Promise<ValidateFunction | undefined> => {
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

export const validatePayload = async (payload: XyoPayload): Promise<boolean> => {
  const validate = await getValidatorForPayload(payload)
  if (!validate) return true
  const valid = await validate(payload)
  return !valid ? false : true
}
