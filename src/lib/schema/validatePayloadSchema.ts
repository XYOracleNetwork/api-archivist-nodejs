import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { GetValidator } from '../../model'
import { getPayloadValidatorFromSchemaCache } from './getPayloadValidatorFromSchemaCache'

export const validatePayloadSchema = async (payload: XyoPayload, getValidator: GetValidator<XyoPayload> = getPayloadValidatorFromSchemaCache): Promise<boolean> => {
  const validate = await getValidator(payload)
  if (!validate) return true
  const valid = await validate(payload)
  return !valid ? false : true
}
