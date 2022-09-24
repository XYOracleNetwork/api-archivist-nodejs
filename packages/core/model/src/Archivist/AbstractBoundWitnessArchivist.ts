import 'reflect-metadata'

import { exists } from '@xylabs/sdk-js'
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
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'
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

  override async query<T extends XyoQuery = XyoQuery>(
    bw: XyoBoundWitness,
    query: T,
    payloads?: XyoPayload[],
  ): Promise<XyoModuleQueryResult<XyoPayload>> {
    if (!this.queries().find((schema) => schema === query.schema)) {
      console.error(`Undeclared Module Query: ${query.schema}`)
    }
    const result: (XyoPayload | null)[] = []
    const typedQuery: XyoArchivistQuery = query as XyoArchivistQuery
    switch (typedQuery.schema) {
      case XyoArchivistFindQuerySchema:
        if (typedQuery.filter) result.push(...(await this.find(typedQuery.filter as XyoBoundWitnessFilterPredicate)))
        break
      case XyoArchivistGetQuerySchema:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.push(...(await this.get(typedQuery.hashes as any as TId[])))
        break
      case XyoArchivistInsertQuerySchema: {
        const actualHashes = payloads?.map((payload) => PayloadWrapper.hash(payload))
        const resolvedPayloads = typedQuery.payloads
          .map((hash) => {
            const index = actualHashes?.indexOf(hash)
            return index !== undefined ? (index > -1 ? result?.[index] ?? null : null) : null
          })
          .filter(exists) as XyoBoundWitness[]
        result.push(await this.insert(resolvedPayloads))
        break
      }
      default:
        throw new Error(`${typedQuery.schema} Not Implemented`)
    }
    return this.bindPayloads(result)
  }
  abstract find(filter?: XyoBoundWitnessFilterPredicate | undefined): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract get(ids: TId[]): Promise<Array<XyoBoundWitnessWithPartialMeta | null>>
  abstract insert(item: XyoBoundWitnessWithPartialMeta[]): Promise<XyoBoundWitness | null>
}
