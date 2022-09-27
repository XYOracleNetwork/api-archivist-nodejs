import 'reflect-metadata'

import { assertEx } from '@xylabs/assert'
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
import { XyoModule, XyoModuleQueryResult, XyoQuery } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoPayloadWithMeta, XyoPayloadWithPartialMeta } from '../Payload'
import { ArchiveModuleConfig } from './ArchiveModuleConfig'
import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject>
  extends XyoModule<XyoArchivistConfig>
  implements PayloadArchivist<T>
{
  constructor(protected readonly config: ArchiveModuleConfig, protected readonly account: XyoAccount) {
    super(config, account)
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
  override async query<T extends XyoQuery = XyoQuery>(
    bw: XyoBoundWitness,
    query: T,
    payloads?: XyoPayload[],
  ): Promise<XyoModuleQueryResult<XyoPayload>> {
    assertEx(this.queryable(query.schema, bw.addresses))
    const result: (XyoPayload | null)[] = []
    const queryAccount = new XyoAccount()
    const typedQuery = query as XyoArchivistQuery
    switch (typedQuery.schema) {
      case XyoArchivistFindQuerySchema:
        if (typedQuery.filter) {
          const typedFilter = typedQuery.filter as XyoPayloadFilterPredicate<T>
          result.push(...(await this.find(typedFilter as any)))
        }
        break
      case XyoArchivistGetQuerySchema:
        result.push(...(await this.get(typedQuery.hashes)))
        break
      case XyoArchivistInsertQuerySchema: {
        result.push(await this.insert(payloads as any))
        break
      }
      default:
        throw new Error(`${typedQuery.schema} Not Implemented`)
    }
    return this.bindPayloads(result, queryAccount)
  }

  abstract find(filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: string[]): Promise<Array<XyoPayloadWithMeta<T> | null>>
  abstract insert(items: XyoPayloadWithPartialMeta<T>[]): Promise<XyoBoundWitness | null>
}
