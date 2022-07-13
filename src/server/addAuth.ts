import 'reflect-metadata'

import { Application } from 'express'
import { decorate, injectable } from 'inversify'
import passport, { Strategy } from 'passport'

import dependencies from '../inversify.config'
import { AdminApiKeyStrategy, adminApiKeyStrategyName, Web3AuthStrategy, web3StrategyName } from '../middleware'

decorate(injectable(), Strategy)

export const addAuth = (_app: Application) => {
  passport.use(web3StrategyName, dependencies.get(Web3AuthStrategy))
  passport.use(adminApiKeyStrategyName, dependencies.get(AdminApiKeyStrategy))
}
