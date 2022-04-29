import { ApiError, ApiLinks } from '@xylabs/sdk-api-express-ecs'
import { ErrorObject } from 'ajv'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

const title = ReasonPhrases.BAD_REQUEST
const status = `${StatusCodes.BAD_REQUEST}`

export const validationErrorToApiError = (err: ErrorObject): ApiError => {
  const code = err.keyword
  const detail = err.message
  const links: ApiLinks = {
    dataPath: {
      href: err.dataPath,
      meta: {},
    },
    schemaPath: {
      href: err.schemaPath,
      meta: {
        parentSchema: err.parentSchema,
      },
    },
  }
  // const source = '' // TODO: Put query param errors here
  const meta = {
    params: err.params,
  }
  const error: ApiError = {
    code,
    detail,
    links,
    meta,
    status,
    title,
  }
  return error
}
