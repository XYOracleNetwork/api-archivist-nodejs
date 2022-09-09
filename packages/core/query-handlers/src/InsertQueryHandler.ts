import { ArchiveArchivist, BoundWitnessArchivist, Query, QueryHandler } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistInsertQueryPayload, XyoBoundWitnessSchema, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { inject, injectable } from 'inversify'

@injectable()
export class InsertQueryHandler implements QueryHandler<Query<XyoArchivistInsertQueryPayload>, XyoPayload> {
  constructor(
    @inject(TYPES.ArchiveArchivist) protected archiveArchivist: ArchiveArchivist,
    @inject(TYPES.BoundWitnessesArchivist) protected boundwitnessArchivist: BoundWitnessArchivist,
  ) {}
  async handle(query: Query<XyoArchivistInsertQueryPayload>) {
    console.log(`Inserting [${query.payload.schema}]`)
    await this.archiveArchivist.insert(
      query.payload.payloads
        .filter((payload) => payload.schema !== XyoBoundWitnessSchema)
        .map((payload) => {
          //TODO: Fix archive and user
          return { ...payload, accessControl: false, archive: 'temp', user: 'arie' }
        }),
    )
    return { schema: 'network.xyo.payload' }
  }
}
