import 'reflect-metadata'

import { ArchivePermissionsArchivist, SetArchivePermissionsPayload, SetArchivePermissionsSchema } from '@xyo-network/archivist-model'

import { AbstractMongoDBPayloadArchivist } from '../AbstractArchivist'

export class MongoDBArchivePermissionsPayloadPayloadArchivist
  extends AbstractMongoDBPayloadArchivist<SetArchivePermissionsPayload>
  implements ArchivePermissionsArchivist
{
  public get schema(): SetArchivePermissionsSchema {
    return SetArchivePermissionsSchema
  }
}
