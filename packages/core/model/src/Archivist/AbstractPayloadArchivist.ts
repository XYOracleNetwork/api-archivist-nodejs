import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import {
  XyoArchivistConfig,
  XyoArchivistFindQuerySchema,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuerySchema,
  XyoArchivistQuery,
} from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { XyoModule, XyoModuleQueryResult } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoPayloadWithMeta, XyoPayloadWithPartialMeta } from '../Payload'
import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject, TId = string>
  extends XyoModule<XyoArchivistConfig, XyoArchivistQuery>
  implements PayloadArchivist<T, TId>
{
  constructor(protected readonly account: XyoAccount) {
    super(undefined, account)
  }

  override queries() {
    return [
      XyoArchivistFindQuerySchema,
      XyoArchivistGetQuerySchema,
      XyoArchivistInsertQuerySchema,
      // TODO: Support initialize, etc.
      // XyoModuleInitializeQuerySchema,
      // XyoModuleShutdownQuerySchema,
    ]
  }

  async query(query: XyoArchivistQuery): Promise<XyoModuleQueryResult> {
    if (!this.queries().find((schema) => schema === query.schema)) {
      console.error(`Undeclared Module Query: ${query.schema}`)
    }

    const payloads: (XyoPayload | null)[] = []
    switch (query.schema) {
      case XyoArchivistFindQuerySchema:
        if (query.filter) payloads.push(...(await this.find(query.filter as XyoPayloadFilterPredicate<T>)))
        break
      case XyoArchivistGetQuerySchema:
        payloads.push(...(await this.get(query.hashes as unknown as TId[])))
        break
      case XyoArchivistInsertQuerySchema:
        payloads.push(await this.insert(query.payloads as XyoPayload<T>[]), ...query.payloads)
        break
      default:
        throw new Error(`${query.schema} Not Implemented`)
    }
    return this.bindPayloads(payloads)
  }

  abstract find(filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId[]): Promise<Array<XyoPayloadWithMeta<T> | null>>
  abstract insert(items: XyoPayloadWithPartialMeta<T>[]): Promise<XyoBoundWitness | null>
}
