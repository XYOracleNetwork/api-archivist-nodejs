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
    // @TODO - use real envs from MongoDB
    throw Error('Please set proper configuration for connecting to MongoDB')
  }

  return env
}
