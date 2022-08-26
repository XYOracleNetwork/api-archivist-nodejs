import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type MongoArchiveSchema = 'xyo.network.mongo.archive'
export const MongoArchiveSchema = 'xyo.network.mongo.archive'

export type MongoArchivePayload = XyoPayload<{
  archive: string
  schema: MongoArchiveSchema
}>
