import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { Container } from 'inversify'

import { MongoDBArchivePermissionsPayloadPayloadRepository } from './middleware'
import { ArchivePermissionsRepository } from './model'

const phrase = assertEx(process.env.ACCOUNT_SEED, 'Seed phrase required to create Archivist XyoAccount')

const container = new Container({ autoBindInjectable: true })
container.bind(XyoAccount).toConstantValue(new XyoAccount({ phrase }))
container.bind<ArchivePermissionsRepository>('ArchivePermissionsRepository').to(MongoDBArchivePermissionsPayloadPayloadRepository)

// eslint-disable-next-line import/no-default-export
export default container
