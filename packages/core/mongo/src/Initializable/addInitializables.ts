import { exists } from '@xylabs/sdk-js'
import { TYPES } from '@xyo-network/archivist-types'
import { Container, ContainerModule, interfaces } from 'inversify'

export const addInitializables = (container: Container) => {
  container.bind(TYPES.Initializable).toDynamicValue((context) => {
    const initializables = [
      context.container.get(TYPES.BoundWitnessStatsDiviner),
      context.container.get(TYPES.ElevationDiviner),
      context.container.get(TYPES.ModuleAddressDiviner),
      context.container.get(TYPES.PayloadStatsDiviner),
      context.container.get(TYPES.SchemaStatsDiviner),
    ]
    return initializables.filter(exists)
  })
}

export const initializables = new ContainerModule((bind: interfaces.Bind, _unbind: interfaces.Unbind) => {
  bind(TYPES.Initializable).toDynamicValue((context) => {
    const initializables = [
      context.container.get(TYPES.BoundWitnessStatsDiviner),
      context.container.get(TYPES.ElevationDiviner),
      context.container.get(TYPES.ModuleAddressDiviner),
      context.container.get(TYPES.PayloadStatsDiviner),
      context.container.get(TYPES.SchemaStatsDiviner),
    ]
    return initializables.filter(exists)
  })
})
