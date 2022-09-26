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
import { ModuleQueryResult, QueryBoundWitnessWrapper, XyoModule, XyoQuery } from '@xyo-network/module'
import { XyoPayload, XyoPayloads } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoPayloadWithMeta, XyoPayloadWithPartialMeta } from '../Payload'
import { PayloadArchivist } from './PayloadArchivist'
import { XyoPayloadFilterPredicate } from './XyoPayloadFilterPredicate'

@injectable()
export abstract class AbstractPayloadArchivist<T extends EmptyObject = EmptyObject, TId = string>
  extends XyoModule<XyoArchivistConfig>
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
  override async query<T extends XyoQuery = XyoQuery>(query: T, payloads?: XyoPayloads): Promise<ModuleQueryResult<XyoPayload>> {
    const wrapper = QueryBoundWitnessWrapper.parseQuery<XyoArchivistQuery>(query)
    const typedQuery = wrapper.query.payload
    assertEx(this.queryable(query.schema, wrapper.addresses))

    const result: (XyoPayload | null)[] = []
    const queryAccount = new XyoAccount()
    switch (typedQuery.schema) {
      case XyoArchivistFindQuerySchema:
        if (typedQuery.filter) {
          const typedFilter = typedQuery.filter as XyoPayloadFilterPredicate<T>
          result.push(...(await this.find(typedFilter as any)))
        }
        break
      case XyoArchivistGetQuerySchema:
        result.push(...(await this.get(typedQuery.hashes as unknown as TId[])))
        break
      case XyoArchivistInsertQuerySchema: {
        result.push(...(await this.insert(payloads as any)))
        break
      }
      default:
        throw new Error(`${typedQuery.schema} Not Implemented`)
    }
    return this.bindResult(result, queryAccount)
  }

  abstract find(filter: XyoPayloadFilterPredicate<T>): Promise<XyoPayloadWithMeta<T>[]>
  abstract get(id: TId[]): Promise<Array<XyoPayloadWithMeta<T> | null>>
  abstract insert(items: XyoPayloadWithPartialMeta<T>[]): Promise<XyoBoundWitness[]>
}
