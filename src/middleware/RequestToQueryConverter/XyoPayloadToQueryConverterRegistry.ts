import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application, Request } from 'express'

import { RequestToQueryConverter } from './RequestToQueryConverter'
import { RequestToQueryConverterRegistry } from './RequestToQueryConverterRegistry'

export class XyoPayloadToQueryConverterRegistry implements RequestToQueryConverterRegistry {
  private _converters: Record<string, RequestToQueryConverter> = {}

  constructor(protected readonly app: Application) {}

  public get converters(): Readonly<Record<string, RequestToQueryConverter>> {
    return this._converters
  }

  public registerConverterForSchema<T extends XyoPayload = XyoPayload, R extends Request = Request>(schema: string, converter: RequestToQueryConverter<T, R>) {
    this._converters[schema] = converter as RequestToQueryConverter
  }
}
