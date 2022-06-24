import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application, Request } from 'express'

import { QueryConverter } from './QueryConverter'
import { QueryConverterRegistry } from './QueryConverterRegistry'

export class XyoPayloadToQueryConverterRegistry implements QueryConverterRegistry {
  private _converters: Record<string, QueryConverter> = {}

  constructor(protected readonly app: Application) {}

  public get converters(): Readonly<Record<string, QueryConverter>> {
    return this._converters
  }

  public registerConverterForSchema<T extends XyoPayload = XyoPayload, R extends Request = Request>(schema: string, converter: QueryConverter<T, R>) {
    this._converters[schema] = converter as QueryConverter
  }
}
