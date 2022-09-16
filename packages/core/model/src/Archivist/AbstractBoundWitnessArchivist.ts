import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import {
  XyoArchivistConfig,
  XyoArchivistFindQuerySchema,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuerySchema,
  XyoArchivistQuery,
  XyoArchivistQuerySchema,
} from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoModule, XyoModuleQueryResult } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'
import { injectable } from 'inversify'

import { XyoBoundWitnessWithMeta } from '../..'
import { BoundWitnessArchivist } from './BoundWitnessArchivist'
import { XyoBoundWitnessFilterPredicate } from './XyoBoundWitnessFilterPredicate'

@injectable()
export abstract class AbstractBoundWitnessArchivist<TId = string>
  extends XyoModule<XyoArchivistConfig, XyoArchivistQuery>
  implements BoundWitnessArchivist<TId>
{
  constructor(protected readonly account: XyoAccount) {
    super(undefined, account)
  }

  public override queries(): XyoArchivistQuerySchema[] {
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
        if (query.filter) payloads.push(...(await this.find(query.filter as XyoBoundWitnessFilterPredicate)))
        break
      case XyoArchivistGetQuerySchema:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payloads.push(...(await this.get(query.hashes as any as TId[])))
        break
      case XyoArchivistInsertQuerySchema:
        payloads.push(await this.insert(query.payloads as XyoBoundWitness[]), ...query.payloads)
        break
      default:
        throw new Error(`${query.schema} Not Implemented`)
    }
    return [this.bindPayloads(payloads), payloads]
  }
  abstract find(filter?: XyoBoundWitnessFilterPredicate | undefined): Promise<Array<XyoBoundWitnessWithMeta | null>>
  abstract get(ids: TId[]): Promise<Array<XyoBoundWitnessWithMeta | null>>
  abstract insert(item: XyoBoundWitness[]): Promise<XyoBoundWitnessWithMeta | null>
}
