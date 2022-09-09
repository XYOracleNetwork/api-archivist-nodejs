import { XyoArchivistGetQueryPayload } from '@xyo-network/archivist'
import { ArchiveArchivist, BoundWitnessArchivist, Query, QueryHandler } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload } from '@xyo-network/payload'
import { inject, injectable } from 'inversify'

@injectable()
export class GetQueryHandler implements QueryHandler<Query<XyoArchivistGetQueryPayload>, XyoPayload> {
  constructor(
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(TYPES.BoundWitnessesArchivist) protected boundwitnessArchivist: BoundWitnessArchivist,
  ) {}
  async handle(query: Query<XyoArchivistGetQueryPayload>) {
    console.log(`Getting [${query.payload.schema}]`)
    return { payloads: await this.archiveArchivist.get(query.payload.hashes), schema: 'network.xyo.payload' }
  }
}
