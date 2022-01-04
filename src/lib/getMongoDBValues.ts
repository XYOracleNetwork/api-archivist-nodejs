import { getEnvFromAws } from '@xylabs/sdk-api-express-ecs'

export const getMongoDBConfig = async () => {
  let env

  if (typeof process.env.MONGO_DOMAIN !== undefined) {
    const envsFromAWS = await getEnvFromAws(
      'arn:aws:secretsmanager:us-east-1:434114103920:secret:api-xyo-archivist-aWFucj'
    )
    env = {
      ...envsFromAWS,
    }
  } else {
    env = {
      MONGO_DATABASE: process.env.MONGO_DATABASE,
      MONGO_DOMAIN: process.env.MONGO_DOMAIN,
      MONGO_PASSWORD: process.env.MONGO_PASSWORD,
      MONGO_USERNAME: process.env.USERNAME,
    }
  }

  return env
}
