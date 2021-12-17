import { getEnvFromAws } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoArchivistBoundWitnessMongoSdk } from '@xyo-network/sdk-xyo-client-js'

export const getArchivistBoundWitnessesMongoSdk = async (archive: string) => {
  const env = await getEnvFromAws('arn:aws:secretsmanager:us-east-1:434114103920:secret:api-xyo-archivist-aWFucj')
  return new XyoArchivistBoundWitnessMongoSdk(
    {
      collection: 'bound_witnesses',
      dbDomain: assertEx(env.MONGO_DOMAIN, 'Missing Mongo Domain'),
      dbName: assertEx(env.MONGO_DATABASE, 'Missing Mongo Database'),
      dbPassword: assertEx(env.MONGO_PASSWORD, 'Missing Mongo Password'),
      dbUserName: assertEx(env.MONGO_USERNAME, 'Missing Mongo Username'),
    },
    archive
  )
}
