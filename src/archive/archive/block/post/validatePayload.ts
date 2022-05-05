import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { getValidatorForPayload } from './getValidatorForPayload'
// eslint-disable-next-line import/no-named-as-default

export const validatePayload = async (payload: XyoPayload): Promise<boolean> => {
  const validate = await getValidatorForPayload(payload)
  if (!validate) return true
  const valid = await validate(payload)
  return !valid ? false : true
}
