import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import { XyoPayloadProcessor } from './XyoPayloadProcessor'
import { XyoPayloadProcessorRegistry } from './XyoPayloadProcessorRegistry'

export class XyoSchemaToPayloadProcessorRegistry implements XyoPayloadProcessorRegistry {
  private _processors: Record<string, XyoPayloadProcessor> = {}

  constructor(protected readonly app: Application) {}

  public get processors(): Readonly<Record<string, XyoPayloadProcessor>> {
    return this._processors
  }

  public registerProcessorForSchema(schema: string, processor: XyoPayloadProcessor<XyoPayload, unknown>) {
    this._processors[schema] = processor
  }
}
