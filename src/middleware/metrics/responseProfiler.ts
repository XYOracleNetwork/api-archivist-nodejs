import { NextFunction, Request, Response } from 'express'

export const responseProfiler = (_req: Request, res: Response, next: NextFunction) => {
  if (!res.locals?.meta) {
    res.locals.meta = {}
  }
  res.locals.meta.profile = {
    startTime: Date.now(),
  }
  next()
}
