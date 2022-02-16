/* eslint-disable @typescript-eslint/no-explicit-any */
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary, Query } from 'express-serve-static-core'

// export const asyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => Promise<void> =
//   nonGeneric

export function genericAsyncHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return asyncHandler(fn as any)
}
