import passport from 'passport'

import { IUserStore } from '../../model'
import { Web3AuthStrategy } from './web3Strategy'

export const configureWeb3Strategy = (userStore: IUserStore) => {
  passport.use('web3', new Web3AuthStrategy(userStore))
}
