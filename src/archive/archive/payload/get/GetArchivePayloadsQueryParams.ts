import { NoReqQuery } from '@xylabs/sdk-api-express-ecs'

import { SortDirection } from '../../../../model'

export interface GetArchivePayloadsQueryParams extends NoReqQuery {
  limit?: string
  order?: SortDirection
  schema?: string
  timestamp?: string
}