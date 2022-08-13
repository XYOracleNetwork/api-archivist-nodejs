import { QueryConverter, QueryConverterRegistry } from '@xyo-network/archivist-express-lib'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Request } from 'express'

export class XyoPayloadToQueryConverterRegistry implements QueryConverterRegistry {
  private _converters: Record<string, QueryConverter> = {}

  public get converters(): Readonly<Record<string, QueryConverter>> {
    return this._converters
  }

  public registerConverterForSchema<T extends XyoPayload = XyoPayload, R extends Request = Request>(schema: string, converter: QueryConverter<T, R>) {
    this._converters[schema] = converter as QueryConverter
  }
}
