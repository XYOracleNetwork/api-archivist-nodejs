import passport from 'passport'

import { UserStore } from '../../model'
import { Web3AuthStrategy } from './web3Strategy'

export const web3StrategyName = 'web3'
export const web3Strategy = passport.authenticate(web3StrategyName, { session: false })

export const configureWeb3Strategy = (userStore: UserStore) => {
  passport.use(web3StrategyName, new Web3AuthStrategy(userStore))
}
