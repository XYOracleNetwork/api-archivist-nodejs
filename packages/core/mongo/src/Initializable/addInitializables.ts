import { exists } from '@xylabs/sdk-js'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addInitializables = (container: Container) => {
  container.bind(TYPES.Initializable).toDynamicValue((context) => {
    const initializables = [
      context.container.get(TYPES.BoundWitnessStatsDiviner),
      context.container.get(TYPES.PayloadStatsDiviner),
      context.container.get(TYPES.SchemaStatsDiviner),
    ]
    return initializables.filter(exists)
  })
}
