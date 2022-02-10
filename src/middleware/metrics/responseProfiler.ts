import { NextFunction, Request, Response } from 'express'

export interface IResponseProfile {
  startTime: number
  endTime: number
  duration: number
}

export const responseProfiler = (_req: Request, res: Response, next: NextFunction) => {
  res.locals.startTime = Date.now()
  next()
}

export const profileResponse = (res: Response): IResponseProfile | null => {
  const startTime = res?.locals?.startTime
  if (startTime) {
    const endTime = Date.now()
    const duration = endTime - startTime
    return { duration, endTime, startTime }
  }
  return null
}
