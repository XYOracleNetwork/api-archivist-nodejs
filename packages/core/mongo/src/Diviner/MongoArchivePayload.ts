import { XyoPayload } from '@xyo-network/payload'

export type MongoArchiveSchema = 'xyo.network.mongo.archive'
export const MongoArchiveSchema = 'xyo.network.mongo.archive'

export type MongoArchivePayload = XyoPayload<{
  archive: string
  schema: MongoArchiveSchema
}>
