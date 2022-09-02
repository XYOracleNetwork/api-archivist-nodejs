import 'reflect-metadata'

import { SetArchivePermissionsPayload, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '@xyo-network/archivist-model'

import { AbstractMongoDBPayloadArchivist } from '../AbstractArchivist'

export class MongoDBArchivePermissionsPayloadPayloadArchivist extends AbstractMongoDBPayloadArchivist<SetArchivePermissionsPayload> {
  public get schema(): SetArchivePermissionsSchema {
    return setArchivePermissionsSchema
  }
}
