import { NextFunction, Request, Response } from 'express'

/**
 * Connect middleware to enable profiling of response lifecycle timing. To effectively profile
 * the response timing, this middleware needs to be called first when initializing your Express
 * App
 * @example
 * const app = express()
 * app.use(responseProfiler)
 * // other initialization ...
 * @param _req The request
 * @param res The response
 * @param next The next function
 */
export const responseProfiler = (_req: Request, res: Response, next: NextFunction) => {
  if (!res.locals?.meta) {
    res.locals.meta = {}
  }
  res.locals.meta.profile = {
    startTime: Date.now(),
  }
  next()
}
