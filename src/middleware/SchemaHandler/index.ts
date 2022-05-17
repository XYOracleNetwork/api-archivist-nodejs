/* eslint-disable @typescript-eslint/no-empty-interface */

import EventEmitter from 'events'
import { IRouter } from 'express'
import { Application } from 'express-serve-static-core'

export interface SchemaHandlers {
  [key: string]: any
  registerHandler: any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export interface AppLocals extends Record<string, any> {
//   schemaRegistry: string
// }
export interface AppLocals {
  schemaRegistry: string
}

// export interface MyApplication extends Application<AppLocals> {
export interface MyApplication {
  locals: AppLocals
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application extends EventEmitter, IRouter, Express.Application {
      locals: AppLocals
      otherLocals: AppLocals
    }

    interface Request {
      app: Application
    }
    interface Response {
      app: Application
    }
  }
}
