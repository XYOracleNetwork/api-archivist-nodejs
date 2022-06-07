import { XyoBoundWitnessMeta } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

import { getHttpHeader } from '../lib'
import { PostNodePathParams } from '../model'

export const getRequestMetaData = (req: Request<PostNodePathParams>): XyoBoundWitnessMeta => {
  const _archive = req.params.archive || 'temp'
  const _source_ip = req.ip ?? undefined
  const _timestamp = Date.now()
  const _user_agent = getHttpHeader('User-agent', req) ?? undefined
  return { _archive, _source_ip, _timestamp, _user_agent }
}
