import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

import { Query } from './Query'

export const getSchemaSchema = 'network.xyo.schema.get'
export type GetSchemaSchema = typeof getSchemaSchema

export interface GetSchema {
  name: string
  schema: GetSchemaSchema
}

export type GetSchemaPayload = XyoPayload<GetSchema>
export type GetSchemaPayloadWithMeta = XyoPayloadWithMeta<GetSchema>

export class GetSchemaQuery extends Query<GetSchema> {}
