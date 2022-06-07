import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Query } from './Query'

export const getSchemaSchema = 'network.xyo.schema.get'
export type GetSchemaSchema = typeof getSchemaSchema

export interface GetSchema {
  name: string
  schema: GetSchemaSchema
}

export type GetSchemaPayload = XyoPayload<GetSchema>

export class GetSchemaQuery extends Query<GetSchemaPayload> {}
