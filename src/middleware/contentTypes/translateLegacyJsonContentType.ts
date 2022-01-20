import { RequestHandler } from 'express'

export const translateLegacyJsonContentTypes: RequestHandler = (req, res, next) => {
  const contentType = req.headers['content-type']
  if (contentType?.includes('text/json')) {
    req.headers['content-type'] = contentType.replace('text/json', 'application/json')
  }
  next()
}
