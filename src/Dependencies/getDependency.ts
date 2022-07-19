import container from './inversify.config'
import { TYPES } from './types'

export const getDependency = (foo: keyof typeof TYPES) => {
  container.get(TYPES[foo])
}
