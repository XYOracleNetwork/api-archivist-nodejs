import { XyoArchivistPayloadMongoSdk } from '@xyo-network/sdk-xyo-client-js'
import { assertEx } from '@xyo-network/sdk-xyo-js'
import dotenv from 'dotenv'

const getArchivistPayloadForwardingMongoSdk = () => {
  dotenv.config()
  return new XyoArchivistPayloadMongoSdk({
    collection: 'payloads',
    dbDomain: assertEx(process.env.MONGO_DOMAIN, 'Missing Mongo Domain'),
    dbName: assertEx(process.env.MONGO_DATABASE, 'Missing Mongo Database'),
    dbPassword: assertEx(process.env.MONGO_PASSWORD, 'Missing Mongo Password'),
    dbUserName: assertEx(process.env.MONGO_USERNAME, 'Missing Mongo Username'),
  })
}

export default getArchivistPayloadForwardingMongoSdk
