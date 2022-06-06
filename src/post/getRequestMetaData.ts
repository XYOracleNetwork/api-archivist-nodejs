import { Request } from 'express'

import { PostNodePathParams } from '../model'

export const getRequestMetaData = (req: Request<PostNodePathParams>) => {
  const _archive = req.params.archive || 'temp'
  const _source_ip = req.ip ?? undefined
  const _user_agent = req.headers['User-agent'] ?? undefined
  const _timestamp = Date.now()
  return { _archive, _source_ip, _timestamp, _user_agent }
}
