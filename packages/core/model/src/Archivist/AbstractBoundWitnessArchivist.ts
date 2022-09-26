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
import { ModuleQueryResult, QueryBoundWitnessWrapper, XyoModule, XyoQuery } from '@xyo-network/module'
import { XyoPayload, XyoPayloads } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoBoundWitnessWithPartialMeta } from '../BoundWitness'
import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId = string> extends XyoModule<XyoArchivistConfig> implements BoundWitnessArchivist<TId> {
  constructor(protected readonly account: XyoAccount) {
    super(undefined, account)
  }

  public override queries() {
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
        if (typedQuery.filter) result.push(...(await this.find(typedQuery.filter as XyoBoundWitnessFilterPredicate)))
        break
      case XyoArchivistGetQuerySchema:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.push(...(await this.get(typedQuery.hashes as any as TId[])))
        break
      case XyoArchivistInsertQuerySchema: {
        result.push(...(await this.insert(payloads as XyoBoundWitnessWithPartialMeta[])))
        break
      }
      default:
        throw new Error(`${typedQuery.schema} Not Implemented`)
    }
    return this.bindResult(result, queryAccount)
  }
  abstract find(filter?: XyoBoundWitnessFilterPredicate | undefined): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract get(ids: TId[]): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract insert(item: XyoBoundWitnessWithPartialMeta[]): Promise<XyoBoundWitness[]>
}
