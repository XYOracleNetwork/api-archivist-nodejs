import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { Container } from 'inversify'

const phrase = assertEx(process.env.ACCOUNT_SEED, 'Seed phrase required to create Archivist XyoAccount')

const container = new Container()
container.bind(XyoAccount).toConstantValue(new XyoAccount({ phrase }))

// eslint-disable-next-line import/no-default-export
export default container
