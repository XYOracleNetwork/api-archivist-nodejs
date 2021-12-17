import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { AWSError } from 'aws-sdk'
import NodeCache from 'node-cache'

const testError = (err: AWSError) => {
  if (err) {
    if (err.code === 'DecryptionFailureException')
      // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err
    else if (err.code === 'InternalServiceErrorException')
      // An error occurred on the server side.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err
    else if (err.code === 'InvalidParameterException')
      // You provided an invalid value for a parameter.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err
    else if (err.code === 'InvalidRequestException')
      // You provided a parameter value that is not valid for the current state of the resource.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err
    else if (err.code === 'ResourceNotFoundException')
      // We can't find the resource that you asked for.
      // Deal with the exception here, and/or rethrow at your discretion.
      throw err
  }
}

const envCache = new NodeCache({ stdTTL: 3600 * 24 })

export const getEnvFromAws = (secretId: string) => {
  return new Promise<Record<string, string>>((resolve, reject) => {
    const cacheResult = envCache.get<Record<string, string>>(secretId)

    if (!cacheResult) {
      const region = 'us-east-1'

      const client = new SecretsManager({
        region: region,
      })

      client.getSecretValue({ SecretId: secretId }, (err, data) => {
        try {
          testError(err)
        } catch (ex) {
          reject(ex)
        }
        console.log(`ENV read from AWS Success [${data?.Name}, ${!!data?.SecretString}, ${!!data?.SecretBinary}]`)
        if (data?.SecretString) {
          const secretObject = JSON.parse(data?.SecretString) as Record<string, string>
          console.log(`ENV read from AWS [${Object.entries(secretObject).length}]`)
          envCache.set(secretId, secretObject)
          resolve(secretObject)
        } else {
          reject(Error('Missing SecretString'))
        }
      })
    } else {
      resolve(cacheResult)
    }
  })
}
