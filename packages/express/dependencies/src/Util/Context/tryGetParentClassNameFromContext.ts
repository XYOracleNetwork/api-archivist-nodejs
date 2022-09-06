import { interfaces } from 'inversify'

interface WithOptionalName {
  name?: string
}

export const tryGetParentClassNameFromContext = (context: interfaces.Context): string | undefined => {
  const parent = context?.currentRequest?.parentRequest?.bindings?.[0]?.implementationType
  return (parent as WithOptionalName)?.name
}
