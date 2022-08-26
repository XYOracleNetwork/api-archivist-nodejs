import { QueryConverterRegistry } from '@xyo-network/archivist-express-lib'
import { XyoPayloadToQueryConverterRegistry } from '@xyo-network/archivist-middleware'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addQueryConverterRegistry = (container: Container) => {
  container.bind<QueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry).toConstantValue(new XyoPayloadToQueryConverterRegistry())
}
