import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export function genericAsyncHandler<
  P = ParamsDictionary,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResBody = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReqBody = any,
  ReqQuery = Query,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Locals extends Record<string, any> = Record<string, any>
>(fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>) {
  return (req: Request<P, ResBody, ReqBody, ReqQuery, Locals>, res: Response<ResBody, Locals>, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }
}
