import { getHttpHeader } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitnessMeta, XyoPayloadMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

export type RequestWithArchive = {
  archive?: string
}

export const getRequestMeta = <T extends RequestWithArchive>(req: Request<T>): [XyoBoundWitnessMeta, XyoPayloadMeta] => {
  const { archive } = req.params || 'temp'
  const _source_ip = req.ip ?? undefined
  const _timestamp = Date.now()
  const _user_agent = getHttpHeader('User-agent', req) || undefined
  const boundWitnessMetaData: XyoBoundWitnessMeta = {
    _archive: archive,
    _source_ip,
    _timestamp,
    _user_agent,
  }
  const payloadMetaData: XyoPayloadMeta = {
    _archive: archive,
    _timestamp,
  }
  return [boundWitnessMetaData, payloadMetaData]
}
