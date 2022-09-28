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
import { XyoModule, XyoModuleQueryResult, XyoQuery } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoBoundWitnessWithPartialMeta } from '../BoundWitness'
import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist extends XyoModule<XyoArchivistConfig> implements BoundWitnessArchivist {
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

  override async query<T extends XyoQuery = XyoQuery>(
    bw: XyoBoundWitness,
    query: T,
    payloads?: XyoPayload[],
  ): Promise<XyoModuleQueryResult<XyoPayload>> {
    assertEx(this.queryable(query.schema, bw.addresses))
    const result: (XyoPayload | null)[] = []
    const queryAccount = new XyoAccount()
    const typedQuery: XyoArchivistQuery = query as XyoArchivistQuery
    switch (typedQuery.schema) {
      case XyoArchivistFindQuerySchema:
        if (typedQuery.filter) result.push(...(await this.find(typedQuery.filter as XyoBoundWitnessFilterPredicate)))
        break
      case XyoArchivistGetQuerySchema:
        result.push(...(await this.get(typedQuery.hashes)))
        break
      case XyoArchivistInsertQuerySchema: {
        result.push(await this.insert(payloads as XyoBoundWitnessWithPartialMeta[]))
        break
      }
      default:
        throw new Error(`${typedQuery.schema} Not Implemented`)
    }
    return this.bindPayloads(result, queryAccount)
  }
  abstract find(filter?: XyoBoundWitnessFilterPredicate | undefined): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract get(ids: string[]): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract insert(item: XyoBoundWitnessWithPartialMeta[]): Promise<XyoBoundWitness | null>
}
