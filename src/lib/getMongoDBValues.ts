import { getEnvFromAws } from '@xylabs/sdk-api-express-ecs'

export const getMongoDBConfig = async (): Promise<Record<string, string | undefined>> => {
  let env: Record<string, string | undefined> = {}
  if (typeof process.env.MONGO_CONNECTION_STRING !== undefined) {
    env.MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING
  }
  if (typeof process.env.MONGO_DOMAIN !== undefined) {
    env.MONGO_DATABASE = process.env.MONGO_DATABASE
    env.MONGO_DOMAIN = process.env.MONGO_DOMAIN
    env.MONGO_PASSWORD = process.env.MONGO_PASSWORD
    env.MONGO_USERNAME = process.env.MONGO_USERNAME
  } else {
    env = await getEnvFromAws('arn:aws:secretsmanager:us-east-1:434114103920:secret:api-xyo-archivist-aWFucj')
  }
  return env
}
