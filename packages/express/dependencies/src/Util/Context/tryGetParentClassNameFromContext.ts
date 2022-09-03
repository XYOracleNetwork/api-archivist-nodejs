import { interfaces } from 'inversify'

export const tryGetParentClassNameFromContext = (context: interfaces.Context): string | undefined => {
  const parent = context?.currentRequest?.parentRequest?.bindings?.[0]?.implementationType
  const name = (parent as { name?: string })?.name
  return name
}
