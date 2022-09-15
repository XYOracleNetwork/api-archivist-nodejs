import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/payload'

import { Query } from './Query'

export type GetSchemaSchema = 'network.xyo.schema.get'
export const GetSchemaSchema: GetSchemaSchema = 'network.xyo.schema.get'

export interface GetSchema {
  name: string
  schema: GetSchemaSchema
}

export type GetSchemaPayload = XyoPayload<GetSchema>
export type GetSchemaPayloadWithMeta = XyoPayloadWithMeta<GetSchema>

export class GetSchemaQuery extends Query<GetSchema> {}
