export type WithValid<T = unknown> = Omit<T, 'valid'> & {
  valid?: boolean
}
