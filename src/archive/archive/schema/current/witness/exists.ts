export const exists = <T>(x: T | undefined): x is T => {
  return !!x
}
