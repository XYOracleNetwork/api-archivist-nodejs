// TODO: Use method from sdk-js instead
export const exists = <T>(x: T | undefined): x is T => {
  return !!x
}
