import 'reflect-metadata'

import { Application } from 'express'
import { decorate, injectable } from 'inversify'
import passport, { Strategy } from 'passport'

import dependencies from '../inversify.config'
import {
  AdminApiKeyStrategy,
  adminApiKeyStrategyName,
  AllowUnauthenticatedStrategy,
  allowUnauthenticatedStrategyName,
  ArchiveAccessControlStrategy,
  archiveAccessControlStrategyName,
  ArchiveAccountStrategy,
  archiveAccountStrategyName,
  Web3AuthStrategy,
  web3StrategyName,
} from '../middleware'

decorate(injectable(), Strategy)

export const addAuth = (_app: Application) => {
  passport.use(adminApiKeyStrategyName, dependencies.get(AdminApiKeyStrategy))
  passport.use(allowUnauthenticatedStrategyName, dependencies.get(AllowUnauthenticatedStrategy))
  passport.use(archiveAccessControlStrategyName, dependencies.get(ArchiveAccessControlStrategy))
  passport.use(archiveAccountStrategyName, dependencies.get(ArchiveAccountStrategy))
  passport.use(web3StrategyName, dependencies.get(Web3AuthStrategy))
}
