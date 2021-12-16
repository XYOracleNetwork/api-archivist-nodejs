import { assertEx } from '@xylabs/sdk-js'
import { XyoArchivistPayloadMongoSdk } from '@xyo-network/sdk-xyo-client-js'

import { getEnvFromAws } from './getEnvFromAws'

export const getArchivistPayloadMongoSdk = async (archive: string) => {
  const env = await getEnvFromAws('api-xyo-archivist')
  return new XyoArchivistPayloadMongoSdk(
    {
      collection: 'payloads',
      dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
      dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
      dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
      dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
    },
    archive
  )
}
