/* eslint-disable simple-import-sort/exports */
// Types need to be evaluated before DI config runs
export * from './types'

export * from './inversify.config'

// eslint-disable-next-line import/no-default-export
export { default as dependencies } from './inversify.config'
