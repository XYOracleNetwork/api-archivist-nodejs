import bodyParser from 'body-parser'
import { NextFunction, Request, Response } from 'express'

const bodyParserInstance = bodyParser.json({ type: ['application/json', 'text/json'] })

// If we do not trap this error, then it dumps too much to log, usually happens if request aborted
export const jsonBodyParser = (req: Request, res: Response, next: NextFunction) => {
  try {
    bodyParserInstance(req, res, next)
  } catch (ex) {
    const error = ex as Error
    console.log(`bodyParser failed [${error.name}]: ${error.message}`)
  }
}
