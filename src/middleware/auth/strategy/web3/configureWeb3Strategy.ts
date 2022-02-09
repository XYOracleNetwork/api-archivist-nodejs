import passport from 'passport'

import { IUserStore } from '../../model'
import { Web3AuthStrategy } from './web3Strategy'

export const WEB3_STRATEGY_NAME = 'web3'
export const web3Strategy = passport.authenticate(WEB3_STRATEGY_NAME, { session: false })

export const configureWeb3Strategy = (userStore: IUserStore) => {
  passport.use(WEB3_STRATEGY_NAME, new Web3AuthStrategy(userStore))
}
