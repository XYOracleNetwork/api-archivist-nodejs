import { Response } from 'express'

export const getResponseMetadata = (res: Response): Record<string, unknown> => {
  const meta: Record<string, unknown> = res.locals?.meta || {}
  // TODO: Do somewhere else
  const profile = res.locals.meta?.profile
  if (profile) {
    const startTime = profile?.startTime
    if (startTime) {
      const endTime = Date.now()
      const duration = endTime - startTime
      res.locals.meta.profile = { duration, endTime, startTime }
    }
  }
  return meta
}
