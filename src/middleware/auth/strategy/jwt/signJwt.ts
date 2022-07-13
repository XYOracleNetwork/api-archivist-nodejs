import { Logger } from '@xylabs/sdk-api-express-ecs'
import jwt, { SignOptions } from 'jsonwebtoken'

import dependencies from '../../../../inversify.config'
import { UserDto } from '../../dto'

export const signJwt = async (user: UserDto, secretOrKey: string, options: SignOptions): Promise<string | undefined> => {
  return await new Promise<string | undefined>((resolve, reject) => {
    // eslint-disable-next-line import/no-named-as-default-member
    jwt.sign({ user }, secretOrKey, options, (err: Error | null, encoded?: string) => {
      if (err) {
        const logger = dependencies.get<Logger>('Logger')
        logger.log('Error signing JWT')
        logger.log(err.message)
        // Don't reject with anything so we don't leak sensitive information
        reject()
      } else {
        resolve(encoded)
      }
    })
  })
}
