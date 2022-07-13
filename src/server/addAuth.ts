import { Application } from 'express'
import passport from 'passport'

import dependencies from '../inversify.config'
import { Web3AuthStrategy, web3StrategyName } from '../middleware'

export const addAuth = (_app: Application) => {
  passport.use(web3StrategyName, dependencies.get(Web3AuthStrategy))
}
