import 'source-map-support/register'

import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const postLogin = (req: Request, res: Response, _next: NextFunction) => {
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
  return
}
