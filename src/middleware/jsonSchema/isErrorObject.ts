import { ErrorObject } from 'ajv'

export const isErrorObject = (item: ErrorObject | undefined): item is ErrorObject => {
  return !!item
}
